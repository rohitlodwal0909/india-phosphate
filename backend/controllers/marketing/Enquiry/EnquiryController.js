const { where } = require("sequelize");
const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const db = require("../../../models");
const { Op } = require("sequelize");
const { getISTDateTime } = require("../../../helper/dateTimeHelper");
const {
  EnquiryModel,
  EnquiryIntrestedProductsModel,
  Customer,
  WorkOrderModel,
  User,
  Product
} = db;

exports.getEnquiries = async (req, res) => {
  try {
    const data = await EnquiryModel.findAll({
      order: [["id", "DESC"]],
      include: [
        {
          model: EnquiryIntrestedProductsModel,
          as: "interested_products",
          required: true,

          include: [
            {
              model: Product,
              as: "product",
              attributes: ["product_name"]
            },
            {
              model: User,
              as: "sales_name"
            }
          ]
        },
        {
          model: Customer,
          as: "customers"
        }
      ]
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
exports.storeEnquiry = async (req, res) => {
  try {
    /* ================= VALIDATION ================= */
    if (!req.body.company_id) {
      return res.status(400).json({
        success: false,
        message: "Company is required"
      });
    }

    /* ================= GET PRODUCTS ================= */
    let products = [];

    if (req.body.products) {
      products =
        typeof req.body.products === "string"
          ? JSON.parse(req.body.products)
          : req.body.products;
    }

    const { entry_date } = getISTDateTime();

    /* ================= SR NO GENERATION ================= */
    const year = new Date().getFullYear();

    const lastEnquiry = await EnquiryModel.findOne({
      where: {
        sr_no: {
          [Op.like]: `ENQ-${year}-%`
        }
      },
      order: [["id", "DESC"]]
    });

    let sr_no = `ENQ-${year}-0001`;

    if (lastEnquiry?.sr_no) {
      const lastNumber = parseInt(lastEnquiry.sr_no.split("-")[2]) || 0;
      const newNumber = lastNumber + 1;

      sr_no = `ENQ-${year}-${String(newNumber).padStart(4, "0")}`;
    }

    /* ================= CREATE ENQUIRY ================= */
    const enquiry = await EnquiryModel.create({
      sr_no,
      company_id: req.body.company_id,
      date: entry_date,
      user_id: req.admin.id
    });

    /* ================= STORE INTERESTED PRODUCTS ================= */
    if (products.length > 0) {
      const productRows = products.map((p) => ({
        enquiry_id: enquiry.id,
        product_id: p.product_id,
        grade: p.grade,
        person_name: p.person_name || p.sales_person || null,
        followups: JSON.stringify(p.followups) || []
      }));

      await EnquiryIntrestedProductsModel.bulkCreate(productRows);
    }

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      message: "Enquiry Created Successfully",
      enquiry_id: enquiry.id,
      sr_no
    });
  } catch (error) {
    console.error("STORE ENQUIRY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    /* ================= PARSE PRODUCTS ================= */

    let products = [];

    if (req.body.products) {
      products =
        typeof req.body.products === "string"
          ? JSON.parse(req.body.products)
          : req.body.products;
    }

    /* ================= UPDATE ENQUIRY ================= */

    await EnquiryModel.update(
      {
        company_id: req.body.company_id
      },
      { where: { id } }
    );

    /* ================= DELETE OLD PRODUCTS ================= */

    await EnquiryIntrestedProductsModel.destroy({
      where: { enquiry_id: id }
    });

    /* ================= ADD NEW PRODUCTS ================= */

    const productRows = products.map((p, index) => {
      return {
        enquiry_id: id,
        product_id: p.product_id,
        grade: p.grade,
        person_name: p.sales_person,
        followups: JSON.stringify(p.followups) || []
      };
    });

    if (productRows.length) {
      await EnquiryIntrestedProductsModel.bulkCreate(productRows);
    }

    /* ================= RESPONSE ================= */

    res.json({
      success: true,
      message: "Enquiry Updated Successfully ✅"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Update failed"
    });
  }
};

exports.deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    /* ================= DELETE CHILD RECORDS ================= */
    await EnquiryIntrestedProductsModel.destroy({
      where: { enquiry_id: id }
    });

    /* ================= DELETE MAIN ENQUIRY ================= */
    await EnquiryModel.destroy({
      where: { id }
    });

    res.json({
      success: true,
      message: "Enquiry Deleted Successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
