const { where } = require("sequelize");
const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const db = require("../../../models");
const { Op } = require("sequelize");
const { getISTDateTime } = require("../../../helper/dateTimeHelper");
const syncCustomerMaster = require("../../../helper/syncCustomerMaster");
const {
  EnquiryModel,
  EnquiryIntrestedProductsModel,
  Customer,
  WorkOrderModel,
  User,
  Product,
  Notification
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

    const { entry_date, entry_time } = getISTDateTime();

    const result = await db.sequelize.transaction(async (transaction) => {
      const customer = await syncCustomerMaster({
        Customer,
        companyId: req.body.company_id,
        details: { ...req.body, products },
        userId: req.admin.id,
        transaction
      });

      /* ================= SR NO GENERATION ================= */
      const year = new Date().getFullYear();
      const lastEnquiry = await EnquiryModel.findOne({
        where: { sr_no: { [Op.like]: `ENQ-${year}-%` } },
        order: [["id", "DESC"]],
        transaction
      });

      let sr_no = `ENQ-${year}-0001`;
      if (lastEnquiry?.sr_no) {
        const lastNumber = parseInt(lastEnquiry.sr_no.split("-")[2]) || 0;
        sr_no = `ENQ-${year}-${String(lastNumber + 1).padStart(4, "0")}`;
      }

      const enquiry = await EnquiryModel.create({
        sr_no,
        company_id: customer.id,
        date: entry_date,
        user_id: req.admin.id
      }, { transaction });

      if (products.length > 0) {
        const productRows = [];
        for (const p of products) {
          productRows.push({
            enquiry_id: enquiry.id,
            product_id: p.product_id,
            grade: p.grade,
            person_name: p.person_name || p.sales_person || null,
            sales_person_id: p.sales_person_id || null,
            followups: JSON.stringify(p.followups || [])
          });

          if (p.sales_person) {
            const latestFollowup = p.followups?.[p.followups.length - 1];
            await Notification.create({
              user_id: p.sales_person,
              title: "New Enquiry Assigned",
              message: `You have been assigned a new enquiry${latestFollowup?.status ? ` (${latestFollowup.status})` : ""}`,
              is_read: 0,
              date_time: `${entry_date} ${entry_time}`
            }, { transaction });
          }
        }
        await EnquiryIntrestedProductsModel.bulkCreate(productRows, { transaction });
      }

      return { enquiry, sr_no };
    });

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      message: "Enquiry Created Successfully",
      enquiry_id: result.enquiry.id,
      sr_no: result.sr_no
    });
  } catch (error) {
    console.error("STORE ENQUIRY ERROR:", error);

    return res.status(error.status || 500).json({
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

    await db.sequelize.transaction(async (transaction) => {
      const currentEnquiry = await EnquiryModel.findByPk(id, { transaction });
      if (!currentEnquiry) {
        const error = new Error("Enquiry not found");
        error.status = 404;
        throw error;
      }
      const customer = await syncCustomerMaster({
        Customer,
        companyId: req.body.company_id || currentEnquiry.company_id,
        details: { ...req.body, products },
        userId: req.admin?.id,
        transaction
      });
      await currentEnquiry.update({ company_id: customer.id }, { transaction });
      await EnquiryIntrestedProductsModel.destroy({ where: { enquiry_id: id }, transaction });

      const productRows = products.map((p) => ({
        enquiry_id: id,
        product_id: p.product_id,
        grade: p.grade,
        person_name: p.sales_person,
        followups: JSON.stringify(p.followups) || []
      }));
      if (productRows.length) {
        await EnquiryIntrestedProductsModel.bulkCreate(productRows, { transaction });
      }
    });

    /* ================= RESPONSE ================= */

    res.json({
      success: true,
      message: "Enquiry Updated Successfully ✅"
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
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
