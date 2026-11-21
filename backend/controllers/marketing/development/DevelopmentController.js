const { where } = require("sequelize");
const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const db = require("../../../models");
const { Op } = require("sequelize");
const { getISTDateTime } = require("../../../helper/dateTimeHelper");
const syncCustomerMaster = require("../../../helper/syncCustomerMaster");
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
    if (!req.body.company_id && !(req.body.company_name && req.body.company_address)) {
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

    const development = await db.sequelize.transaction(async (transaction) => {
      const customer = await syncCustomerMaster({
        Customer,
        companyId: req.body.company_id,
        details: { ...req.body, products },
        userId: req.admin.id,
        transaction
      });
      const record = await DevelopmentModel.create({
        company_id: customer.id,
        date: entry_date,
        user_id: req.admin.id
      }, { transaction });

      if (products.length > 0) {
        const productRows = products.map((p) => ({
          development_id: record.id,
          product_id: p.product_id,
          grade: p.grade,
          person_name: p.purchase_person || null,
          followups: JSON.stringify(p.followups) || []
        }));
        await DevelopmentIntrestedProductsModel.bulkCreate(productRows, { transaction });
      }
      return record;
    });

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      message: "Development Created Successfully",
      development_id: development.id
    });
  } catch (error) {
    console.error("STORE ENQUIRY ERROR:", error);

    return res.status(error.status || 500).json({
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

    await db.sequelize.transaction(async (transaction) => {
      const development = await DevelopmentModel.findByPk(id, { transaction });
      if (!development) {
        const error = new Error("Development enquiry not found");
        error.status = 404;
        throw error;
      }
      const customer = await syncCustomerMaster({
        Customer,
        companyId: req.body.company_id || development.company_id,
        details: { ...req.body, products },
        userId: req.admin?.id,
        transaction
      });
      await development.update({ company_id: customer.id }, { transaction });
      await DevelopmentIntrestedProductsModel.destroy({ where: { development_id: id }, transaction });

      const productRows = products.map((p) => ({
        development_id: id,
        product_id: p.product_id,
        grade: p.grade,
        person_name: p.purchase_person,
        followups: JSON.stringify(p.followups) || []
      }));
      if (productRows.length) {
        await DevelopmentIntrestedProductsModel.bulkCreate(productRows, { transaction });
      }
    });

    /* ================= RESPONSE ================= */

    res.json({
      success: true,
      message: "Development Updated Successfully ✅"
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
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
