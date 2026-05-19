const { where } = require("sequelize");
const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const db = require("../../../models");
const { Op } = require("sequelize");
const { getISTDateTime } = require("../../../helper/dateTimeHelper");
const {
  DevelopmentModel,
  DevelopmentIntrestedProductsModel,
  Customer,
  WorkOrderModel,
  User,
  Product
} = db;

exports.getDevelopment = async (req, res) => {
  try {
    const data = await DevelopmentModel.findAll({
      order: [["id", "DESC"]],
      include: [
        {
          model: DevelopmentIntrestedProductsModel,
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
exports.storeDevelopment = async (req, res) => {
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

    /* ================= CREATE ENQUIRY ================= */
    const development = await DevelopmentModel.create({
      company_id: req.body.company_id,
      date: entry_date,
      user_id: req.admin.id
    });

    /* ================= STORE INTERESTED PRODUCTS ================= */
    if (products.length > 0) {
      const productRows = products.map((p) => ({
        development_id: development.id,
        product_id: p.product_id,
        grade: p.grade,
        person_name: p.purchase_person || null,
        followups: JSON.stringify(p.followups) || []
      }));

      await DevelopmentIntrestedProductsModel.bulkCreate(productRows);
    }

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      message: "Development Created Successfully",
      development_id: development.id
    });
  } catch (error) {
    console.error("STORE ENQUIRY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateDevelopment = async (req, res) => {
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

    await DevelopmentModel.update(
      {
        company_id: req.body.company_id
      },
      { where: { id } }
    );

    /* ================= DELETE OLD PRODUCTS ================= */

    await DevelopmentIntrestedProductsModel.destroy({
      where: { development_id: id }
    });

    /* ================= ADD NEW PRODUCTS ================= */

    const productRows = products.map((p, index) => {
      return {
        development_id: id,
        product_id: p.product_id,
        grade: p.grade,
        person_name: p.purchase_person,
        followups: JSON.stringify(p.followups) || []
      };
    });

    if (productRows.length) {
      await DevelopmentIntrestedProductsModel.bulkCreate(productRows);
    }

    /* ================= RESPONSE ================= */

    res.json({
      success: true,
      message: "Development Updated Successfully ✅"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Update failed"
    });
  }
};

exports.deleteDevelopment = async (req, res) => {
  try {
    const { id } = req.params;

    /* ================= DELETE CHILD RECORDS ================= */
    await DevelopmentIntrestedProductsModel.destroy({
      where: { development_id: id }
    });

    /* ================= DELETE MAIN ENQUIRY ================= */
    await DevelopmentModel.destroy({
      where: { id }
    });

    res.json({
      success: true,
      message: "Development Deleted Successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
