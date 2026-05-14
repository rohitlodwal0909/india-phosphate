const { where } = require("sequelize");
const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const db = require("../../../models");
const {
  SampleRequestModel,
  SampleProductsModel,
  Customer,
  WorkOrderModel,
  Product,
  User
} = db;

exports.getSampleRequest = async (req, res) => {
  try {
    const data = await SampleRequestModel.findAll({
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
          model: SampleProductsModel,
          as: "interested_products",
          required: false,
          include: [
            {
              model: Product,
              as: "product",
              required: false
            }
          ]
        }
      ]
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.storeSampleRequest = async (req, res) => {
  try {
    /* ------------------ Parse Items ------------------ */

    /* ------------------ Attach Files ------------------ */
    let items =
      typeof req.body.items === "string"
        ? JSON.parse(req.body.items)
        : req.body.items;

    /* FILE MAP */
    const fileMap = {};

    (req.files || []).forEach((file) => {
      fileMap[file.fieldname] = file.filename;
    });

    /* ATTACH FILE TO ITEMS */
    items = items.map((item, index) => ({
      ...item,
      file: fileMap[`file_${index}`] || null
    }));

    /* ------------------ Generate SR No ------------------ */
    const year = new Date().getFullYear();

    const lastSR = await SampleRequestModel.findOne({
      order: [["id", "DESC"]]
    });

    let sr_no = `S-${year}-001`;

    if (lastSR && lastSR.sr_no) {
      const lastNumber = parseInt(lastSR.sr_no.split("-")[2]);
      const newNumber = lastNumber + 1;

      sr_no = `S-${year}-${String(newNumber).padStart(3, "0")}`;
    }

    /* ------------------ Create Sample Request ------------------ */
    const sampleRequest = await SampleRequestModel.create({
      ...req.body,
      user_id: req.admin.id,
      sr_no
    });

    /* ------------------ Prepare Products ------------------ */
    const productData = items.map((item) => ({
      sample_id: sampleRequest.id,
      product_id: item.product_id,
      grade: item.grade,
      qty: item.qty,
      sample_type: item.sample_type,
      file: item.file || null
    }));

    /* ------------------ Bulk Insert Products ------------------ */
    if (productData.length > 0) {
      await SampleProductsModel.bulkCreate(productData);
    }

    /* ------------------ Response ------------------ */
    res.json({
      message: "Sample Request Created Successfully",
      data: sampleRequest
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
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

    await PurchaseOrderModel.update(updateData, {
      where: { id }
    });

    res.json({
      message: "Purchase Order Updated Successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
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
