const { where } = require("sequelize");
const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const {
  Customer,
  User,
  PurchaseOrderModel,
  Product,
  DevelopmentModel,
  SampleRequestModel,
  EnquiryModel,
  WorkOrderModel,
  FMIssuedModel,
  DispatchVehicle,
  Invoice,
  ReplacementModel
} = db;

// Create
exports.createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create({
      company_name: req.body.company_name,
      application: req.body.application,
      company_hq: req.body.company_hq,
      company_address: req.body.company_address,
      customer_type: req.body.customer_type,
      trader_names: req.body.trader_names,
      open_field: req.body.open_field,
      contacts: req.body.contacts,
      addresses: req.body.addresses,
      products: req.body.products,
      user_id: req.admin.id
    });

    res.status(200).json({
      success: true,
      message: "Customer Created Successfully",
      data: customer
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

exports.getCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      const error = new Error("Customer entry not found");
      error.status = 404;
      return next(error);
    }

    res.json(customer);
  } catch (error) {
    next(error);
  }
};

// Read By ID
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      order: [["id", "DESC"]],
      where: {
        convert_to_customer: false,
        potential_opportunity: 0
      }
    });

    const formattedCustomers = customers.map((customer) => {
      return {
        ...customer.toJSON(),
        trader_names: customer.trader_names
          ? JSON.parse(customer.trader_names)
          : [],
        contacts: customer.contacts ? JSON.parse(customer.contacts) : [],
        addresses: customer.addresses ? JSON.parse(customer.addresses) : [],
        products: customer.products ? JSON.parse(customer.products) : []
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedCustomers
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

exports.getExistingCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      order: [["id", "DESC"]],
      where: {
        convert_to_customer: true
      }
    });

    const formattedCustomers = customers.map((customer) => {
      return {
        ...customer.toJSON(),
        trader_names: customer.trader_names
          ? JSON.parse(customer.trader_names)
          : [],
        contacts: customer.contacts ? JSON.parse(customer.contacts) : [],
        addresses: customer.addresses ? JSON.parse(customer.addresses) : [],
        products: customer.products ? JSON.parse(customer.products) : []
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedCustomers
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

exports.getProductsWithPo = async (req, res) => {
  try {
    const id = req.params.id;

    const purchaseOrders = await PurchaseOrderModel.findAll({
      order: [["id", "DESC"]],
      attributes: ["products"],
      where: {
        company_id: id
      }
    });

    let allProductIds = [];

    // ✅ Step 1: Parse and collect product_ids
    purchaseOrders.forEach((po) => {
      if (po.products) {
        const productsArray = JSON.parse(po.products); // 🔥 important

        productsArray.forEach((item) => {
          allProductIds.push(item.product_id);
        });
      }
    });

    // ✅ Step 2: Remove duplicates
    allProductIds = [...new Set(allProductIds)];

    // ✅ Step 3: Fetch product details
    const productDetails = await Product.findAll({
      where: {
        id: allProductIds
      }
    });

    return res.status(200).json({
      success: true,
      data: productDetails
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// Update
exports.updateCustomer = async (req, res) => {
  try {
    const {
      id,
      company_name,
      application,
      customer_type,
      trader_names,
      open_field,
      company_hq,
      company_address,
      contacts,
      addresses,
      products
    } = req.body;

    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    await customer.update({
      company_name: company_name || "",
      application: application || "",
      customer_type: customer_type || "",
      company_hq: company_hq || "",
      company_address: company_address || "",
      trader_names: JSON.stringify(trader_names || []),
      open_field: open_field || "",
      contacts: JSON.stringify(contacts || []),
      addresses: JSON.stringify(addresses || []),
      products: JSON.stringify(products || [])
    });

    return res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      data: customer
    });
  } catch (error) {
    console.error("Update Customer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

// Delete
exports.deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      const error = new Error("Customer entry not found");
      error.status = 404;
      return next(error);
    }
    const user_id = req.body?.user_id || customer?.user_id;
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
    const user = await User.findByPk(user_id);
    const username = user ? user?.username : "Unknown User";
    const logMessage = `Customer Name ${customer?.customer_name}  was deleted by ${username} on ${entry_date} at ${entry_time}.`;
    await createLogEntry({
      user_id,
      message: logMessage
    });

    await customer.destroy();
    res.json({ message: "Customer entry deleted" });
  } catch (error) {
    next(error);
  }
};

exports.addNote = async (req, res) => {
  try {
    const { id, note } = req.body;

    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    await customer.update({
      note: note || "",
      convert_to_customer: true
    });

    return res.status(200).json({
      success: true,
      message: "Convert existing customer successfully",
      data: customer
    });
  } catch (error) {
    console.error("Convert existing customer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

exports.customerJourney = async (req, res) => {
  try {
    const id = req.params.id;

    const [customer, development, samplerequest, po, enquiry] =
      await Promise.all([
        Customer.findOne({
          attributes: ["created_at"],
          where: { id }
        }),

        DevelopmentModel.findOne({
          order: [["id", "DESC"]],
          attributes: ["created_at"],
          where: { company_id: id }
        }),

        SampleRequestModel.findOne({
          order: [["id", "DESC"]],
          attributes: ["created_at"],
          where: { company_id: id }
        }),

        PurchaseOrderModel.findOne({
          order: [["id", "DESC"]],
          attributes: ["id", "created_at"],
          where: { company_id: id }
        }),

        EnquiryModel.findOne({
          order: [["id", "DESC"]],
          attributes: ["created_at"],
          where: { company_id: id }
        })
      ]);

    // =========================
    // WORK ORDER
    // =========================

    let workOrder = null;

    if (po?.id) {
      workOrder = await WorkOrderModel.findOne({
        order: [["id", "DESC"]],
        attributes: ["work_order_no", "created_at"],
        where: {
          po_id: po.id,
          status: "Approved"
        }
      });
    }

    // =========================
    // MANUFACTURING
    // =========================

    let manufacturing = null;

    if (workOrder?.work_order_no) {
      manufacturing = await FMIssuedModel.findOne({
        order: [["id", "DESC"]],
        attributes: ["created_at"],
        where: {
          work_order_no: workOrder.work_order_no
        }
      });
    }

    // =========================
    // DISPATCH
    // =========================

    let dispatch = null;

    if (po?.id) {
      dispatch = await DispatchVehicle.findOne({
        order: [["id", "DESC"]],
        attributes: ["id", "dispatch_date"],
        where: {
          po_id: po.id
        }
      });
    }

    // =========================
    // ACCOUNTS / INVOICE
    // =========================

    let accounts = null;

    if (dispatch?.id) {
      accounts = await Invoice.findOne({
        order: [["id", "DESC"]],
        attributes: ["id", "created_at"],
        where: {
          dispatch_id: dispatch.id
        }
      });
    }

    // =========================
    // REJECTION / REPLACEMENT
    // =========================

    let rejection = null;

    if (accounts?.id) {
      rejection = await ReplacementModel.findOne({
        order: [["id", "DESC"]],
        attributes: ["created_at"],
        where: {
          invoice_no: accounts.id
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        customer,
        development,
        samplerequest,
        po,
        enquiry,
        workOrder,
        manufacturing,
        dispatch,
        accounts,
        rejection
      }
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
