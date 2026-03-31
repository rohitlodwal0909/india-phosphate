const db = require("../../../models");

const { QuotationModel } = db;

/* ======================================================
   CREATE QUOTATION
====================================================== */
exports.createQuotation = async (req, res) => {
  try {
    const data = await QuotationModel.create({
      user_id: req.admin.id,
      company_name: req.body.company_name,
      contact_person: req.body.contact_person,
      mobile: req.body.mobile,
      trade_type: req.body.trade_type,
      country: req.body.country,
      inco_term: req.body.inco_term,
      discharge_port: req.body.discharge_port,
      remark: req.body.remark,
      products: req.body.products
    });

    return res.status(200).json({
      message: "Quotation created successfully",
      data
    });
  } catch (error) {
    console.error("Create Error:", error);

    return res.status(500).json({
      message: "Quotation creation failed"
    });
  }
};

/* ======================================================
   UPDATE QUOTATION
====================================================== */
exports.updateQuotation = async (req, res) => {
  try {
    const { id } = req.params;

    const quotation = await QuotationModel.findByPk(id);

    if (!quotation) {
      return res.status(404).json({
        message: "Quotation not found"
      });
    }

    await quotation.update({
      company_name: req.body.company_name,
      contact_person: req.body.contact_person,
      mobile: req.body.mobile,
      trade_type: req.body.trade_type,
      country: req.body.country,
      inco_term: req.body.inco_term,
      discharge_port: req.body.discharge_port,
      remark: req.body.remark,
      products: req.body.products,
      user_id: req.admin.id
    });

    return res.status(200).json({
      message: "Quotation updated successfully",
      data: quotation
    });
  } catch (error) {
    console.error("Update Error:", error);

    return res.status(500).json({
      message: "Update failed"
    });
  }
};

/* ======================================================
   GET ALL QUOTATION
====================================================== */
exports.getQuotation = async (req, res) => {
  try {
    const data = await QuotationModel.findAll({
      order: [["id", "DESC"]]
    });

    return res.status(200).json({
      message: "Quotation list",
      data
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message
    });
  }
};

/* ======================================================
   DELETE QUOTATION
====================================================== */
exports.deleteQuotation = async (req, res) => {
  try {
    const { id } = req.params;

    const quotation = await QuotationModel.findByPk(id);

    if (!quotation) {
      return res.status(404).json({
        message: "Quotation not found"
      });
    }

    await quotation.destroy();

    return res.status(200).json({
      message: "Quotation deleted successfully",
      id
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message
    });
  }
};
