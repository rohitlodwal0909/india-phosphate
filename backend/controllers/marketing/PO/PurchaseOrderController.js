const { where } = require("sequelize");
const { Op } = require("sequelize");
const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const db = require("../../../models");
const { PurchaseOrderModel, Customer, WorkOrderModel, User, Invoice } = db;
const { getISTDateTime } = require("../../../helper/dateTimeHelper");
const syncCustomerMaster = require("../../../helper/syncCustomerMaster");

exports.getPurchaseOrders = async (req, res) => {
  try {
    const data = await PurchaseOrderModel.findAll({
      order: [["id", "DESC"]],
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "username"]
        },
        {
          model: Customer,
          as: "customers"
        },
        {
          model: WorkOrderModel,
          as: "workNo",
          required: false
        }
      ]
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPoReport = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await PurchaseOrderModel.findOne({
      where: { id },
      include: [
        {
          model: Customer,
          as: "customers"
        }
      ]
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPoTracker = async (req, res) => {
  try {
    const po = await PurchaseOrderModel.findByPk(req.params.id, {
      include: [{ model: Customer, as: "customers", required: false }]
    });
    if (!po) return res.status(404).json({ message: "Purchase Order not found." });

    const workOrders = await WorkOrderModel.findAll({
      where: { po_id: po.id },
      order: [["created_at", "ASC"]]
    });
    const workOrderIds = workOrders.map((item) => item.id);
    const workOrderNumbers = [...new Set(workOrders.map((item) => item.work_order_no).filter(Boolean))];
    const workOrderCondition = workOrderNumbers.length ? { [Op.in]: workOrderNumbers } : null;

    const [planning, batches, materialIssues, dispatches, bills, disputes, replacements] = await Promise.all([
      workOrderCondition && db.ProductionPlanning
        ? db.ProductionPlanning.findAll({ where: { work_order_no: workOrderCondition }, order: [["created_at", "ASC"]] })
        : [],
      workOrderCondition && db.Qcbatch
        ? db.Qcbatch.findAll({ where: { work_order_no: workOrderCondition }, order: [["created_at", "ASC"]] })
        : [],
      workOrderCondition && db.FMIssuedModel
        ? db.FMIssuedModel.findAll({ where: { work_order_no: workOrderCondition }, order: [["created_at", "ASC"]] })
        : [],
      db.DispatchVehicle.findAll({
        where: {
          [Op.or]: [
            { po_id: po.id },
            ...(workOrderNumbers.length ? [{ work_order_no: workOrderCondition }] : [])
          ]
        },
        order: [["created_at", "ASC"]]
      }),
      db.BillModel
        ? db.BillModel.findAll({ where: { po_no: po.po_no }, order: [["created_at", "ASC"]] })
        : [],
      db.DisputeModel
        ? db.DisputeModel.findAll({ where: { dispute_type: "po", dispute_type_id: String(po.id) }, order: [["created_at", "ASC"]] })
        : [],
      db.ReplacementModel
        ? db.ReplacementModel.findAll({
            where: {
              [Op.or]: [
                { marketing_po_id: po.id },
                ...(workOrderIds.length ? [{ work_order_id: { [Op.in]: workOrderIds } }] : [])
              ]
            },
            order: [["created_at", "ASC"]]
          })
        : []
    ]);

    const dispatchIds = dispatches.map((item) => item.id);
    const invoices = dispatchIds.length
      ? await db.Invoice.findAll({ where: { dispatch_id: { [Op.in]: dispatchIds } }, order: [["created_at", "ASC"]] })
      : [];
    const batchIds = batches.map((item) => String(item.id));
    const manufacturing = batchIds.length && db.ProductionResult
      ? await db.ProductionResult.findAll({ where: { batch_id: { [Op.in]: batchIds } }, order: [["created_at", "ASC"]] })
      : [];
    const batchNumbers = batches.map((item) => String(item.id));
    const finishing = batchNumbers.length && db.Finishing
      ? await db.Finishing.findAll({ where: { batch_number: { [Op.in]: batchNumbers } }, order: [["created_at", "ASC"]] })
      : [];

    const stages = [
      { key: "po", title: "Purchase Order", records: [po] },
      { key: "work_order", title: "Work Order", records: workOrders },
      { key: "planning", title: "Production Planning", records: planning },
      { key: "material_issue", title: "Material Issue", records: materialIssues },
      { key: "batch", title: "QC Batch", records: batches },
      { key: "manufacturing", title: "Manufacturing", records: manufacturing },
      { key: "finishing", title: "Finishing", records: finishing },
      { key: "dispatch", title: "Dispatch", records: dispatches },
      { key: "accounts", title: "Accounts", records: [...bills, ...invoices] },
      { key: "replacement", title: "Replacement / Rejection", records: replacements },
      { key: "dispute", title: "Dispute", records: disputes }
    ].map((stage) => ({
      ...stage,
      completed: stage.records.length > 0,
      latest_date: stage.records.length
        ? stage.records.reduce((latest, record) => {
            const date = record.created_at || record.date || record.dispatch_date;
            return !latest || (date && new Date(date) > new Date(latest)) ? date : latest;
          }, null)
        : null
    }));

    const reachedStage = [...stages]
      .filter((stage) => !["replacement", "dispute"].includes(stage.key))
      .reverse()
      .find((stage) => stage.completed);
    return res.json({ po, stages, current_stage: reachedStage?.title || "Purchase Order" });
  } catch (error) {
    console.error("GET PO TRACKER ERROR:", error);
    return res.status(500).json({ message: error.message || "Could not load PO Tracker." });
  }
};

exports.getCustomers = async (req, res) => {
  try {
    const data = await Customer.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.storePurchaseOrder = async (req, res) => {
  try {
    let products = [];
    if (req.body.products) {
      products = JSON.parse(req.body.products);
    }

    const files = req.files || [];

    products = products.map((p, index) => {
      const file = files.find((f) => f.fieldname === `file_${index}`);
      if (file) {
        p.file = file.filename;
      }
      return p;
    });

    const result = await db.sequelize.transaction(async (transaction) => {
      const uniqepo = await PurchaseOrderModel.findOne({
        where: { po_no: req.body.po_no },
        transaction
      });
      if (uniqepo) {
        const error = new Error("PO Number already exists");
        error.status = 404;
        throw error;
      }

      const customer = await syncCustomerMaster({
        Customer,
        companyId: req.body.company_id,
        details: { ...req.body, products },
        userId: req.admin.id,
        transaction
      });
      const data = await PurchaseOrderModel.create({
        ...req.body,
        company_id: customer.id,
        products: JSON.stringify(products),
        user_id: req.admin.id
      }, { transaction });

      const lastWO = await WorkOrderModel.findOne({
        order: [["id", "DESC"]],
        transaction
      });
      let work_order_no = "WO-001";
      if (lastWO?.work_order_no) {
        const lastNumber = parseInt(lastWO.work_order_no.split("-")[1]);
        work_order_no = `WO-${String(lastNumber + 1).padStart(3, "0")}`;
      }
      await WorkOrderModel.create({
        po_id: data.id,
        work_order_no,
        user_id: req.admin.id
      }, { transaction });
      return { data, work_order_no };
    });

    res.json({
      message: "Purchase Order Created",
      data: result.data,
      work_order_no: result.work_order_no
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message
    });
  }
};

exports.updateWorkOrderStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    const workOrder = await WorkOrderModel.findByPk(id);

    if (!workOrder) {
      return res.status(404).json({
        success: false,
        message: "Work Order not found"
      });
    }

    await workOrder.update({ status });

    let title = "Work Order Status";
    let message = "";

    if (status === "Approved") {
      message = `Work Order ${workOrder.work_order_no} has been approved.`;
    } else if (status === "Rejected") {
      message = `Work Order ${workOrder.work_order_no} has been rejected.`;
    } else {
      message = `Work Order ${workOrder.work_order_no} status updated to ${status}.`;
    }

    await createNotificationByRoleId({
      title,
      message,
      link: "inventory/work-order",
      role_id: 3
    });

    res.json({
      success: true,
      message: `Work Order ${status}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.paymentApproved = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Find Purchase Order
    const po = await Invoice.findByPk(id);

    if (!po) {
      return res.status(404).json({
        success: false,
        message: "Purchase Order not found"
      });
    }
    const { entry_date } = getISTDateTime();

    // Update Status
    await po.update({ payment_status: status, payment_date: entry_date });

    // Notification Message
    let title = "Purchase Order Payment Status";
    let message = "";

    if (status === "Approved") {
      message = `Purchase Order ${po.po_no} Payment has been approved.`;
    } else if (status === "Rejected") {
      message = `Purchase Order ${po.po_no} Payment has been rejected.`;
    } else {
      message = `Purchase Order ${po.po_no} Payment status updated to ${status}.`;
    }

    // Create Notification
    await createNotificationByRoleId({
      title,
      message,
      role_id: 11,
      module_id: 6,
      link: "accounts/payment",
      submodule_id: 3
    });

    return res.status(200).json({
      success: true,
      message: `Purchase Order Payment ${status} successfully`
    });
  } catch (error) {
    console.error("paymentApproved Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.paymentRemark = async (req, res) => {
  try {
    const { id } = req.params;
    const { remark } = req.body;

    // Find Purchase Order
    const po = await Invoice.findByPk(id);

    if (!po) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found"
      });
    }

    // Update Status
    await po.update({ account_payment_remark: remark });

    // Notification Message

    return res.status(200).json({
      success: true,
      message: `Remark successfully added!`
    });
  } catch (error) {
    console.error("paymentApproved Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.addRemark = async (req, res) => {
  try {
    const { remark, po_id, id } = req.body;

    // duplicate check
    const existing = await WorkOrderModel.findOne({
      where: { po_id }
    });

    if (existing && existing.id !== id) {
      return res.status(400).json({
        success: false,
        message: "Work Order No already exists"
      });
    }

    let data;

    if (id) {
      // UPDATE
      await WorkOrderModel.update(
        {
          remark
        },
        {
          where: { id }
        }
      );

      data = await WorkOrderModel.findByPk(id);

      return res.json({
        success: true,
        message: "Remark Updated Successfully",
        data
      });
    } else {
      // CREATE
      data = await WorkOrderModel.create({
        po_id,
        remark,
        user_id: req.admin.id
      });

      return res.json({
        success: true,
        message: "Remark Created Successfully",
        data
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.addDepartmentRemark = async (req, res) => {
  try {
    const { department, remark, po_id, id } = req.body;

    // duplicate check
    const existing = await WorkOrderModel.findOne({
      where: { po_id }
    });

    if (existing && existing.id !== id) {
      return res.status(400).json({
        success: false,
        message: "Work Order No already exists"
      });
    }

    let data;

    if (id) {
      // UPDATE
      await WorkOrderModel.update(
        {
          department,
          department_remark: remark
        },
        {
          where: { id }
        }
      );

      data = await WorkOrderModel.findByPk(id);

      return res.json({
        success: true,
        message: "Remark Updated Successfully",
        data
      });
    } else {
      // CREATE
      data = await WorkOrderModel.create({
        po_id,
        department,
        department_remark: remark,
        user_id: req.admin.id
      });

      return res.json({
        success: true,
        message: "Remark Created Successfully",
        data
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updatePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;

    let products = [];

    // products JSON parse
    if (req.body.products) {
      products =
        typeof req.body.products === "string"
          ? JSON.parse(req.body.products)
          : req.body.products;
    }

    // attach uploaded files to products
    if (req.files) {
      products = products.map((p, index) => {
        const file = req.files[`file_${index}`];
        if (file) {
          p.file = file[0].filename;
        }
        return p;
      });
    }

    // const uniqepo = await PurchaseOrderModel.findOne({
    //   where: {
    //     po_no: req.body.po_no
    //   }
    // });
    // if (uniqepo) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "PO Number already exists"
    //   });
    // }

    const updateData = {
      // ✅ Basic
      po_no: req.body.po_no,
      company_id: req.body.company_id,
      company_type: req.body.company_type,
      company_address: req.body.company_address,
      delivery_address: req.body.delivery_address,
      customer_name: req.body.customer_name,
      po_date: req.body.po_date,
      destination: req.body.destination,
      po_remark: req.body.po_remark,

      // ✅ Products
      products: JSON.stringify(products),

      // ✅ Financial
      freight: req.body.freight,
      payment_terms: req.body.payment_terms,
      remark: req.body.remark,
      commission: req.body.commission,

      // ✅ Insurance
      insurance: req.body.insurance,
      insurance_remark: req.body.insurance_remark,

      // ✅ Type
      domestic: req.body.type === "domestic",
      export: req.body.type === "export",

      // ✅ Export Fields
      country_name: req.body.country_name,
      inco_term: req.body.inco_term,
      discharge_port: req.body.discharge_port,

      // ✅ Other
      customise_labels: req.body.customise_labels,
      expected_delivery_date: req.body.expected_delivery_date,
      priority: req.body.priority
    };

    await db.sequelize.transaction(async (transaction) => {
      const purchaseOrder = await PurchaseOrderModel.findByPk(id, { transaction });
      if (!purchaseOrder) {
        const error = new Error("Purchase Order not found");
        error.status = 404;
        throw error;
      }
      const customer = await syncCustomerMaster({
        Customer,
        companyId: req.body.company_id || purchaseOrder.company_id,
        details: { ...req.body, products },
        userId: req.admin?.id,
        transaction
      });
      updateData.company_id = customer.id;
      await PurchaseOrderModel.update(updateData, {
        where: { id },
        transaction
      });
    });

    res.json({
      message: "Purchase Order Updated Successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || "Update failed"
    });
  }
};

exports.deletePurchaseOrder = async (req, res) => {
  try {
    await PurchaseOrderModel.destroy({
      where: { id: req.params.id }
    });

    res.json({ message: "Purchase Order Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
