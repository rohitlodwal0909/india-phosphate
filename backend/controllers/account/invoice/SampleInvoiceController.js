const db = require("../../../models");
const fs = require("fs");
const ExcelJS = require("exceljs");
const path = require("path");

const { SampleInvoice } = db;

/* ======================================================
   CREATE
====================================================== */
exports.uploadSampleInvoice = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "File required" });

    const invoice = await SampleInvoice.create({
      name: req.body.name,
      user_id: req.admin.id,
      file: req.file.path
    });

    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   GET ALL
====================================================== */
exports.getSampleInvoice = async (req, res) => {
  try {
    const invoices = await SampleInvoice.findAll({
      order: [["id", "DESC"]]
    });

    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   UPDATE
====================================================== */
exports.updateSampleInvoice = async (req, res) => {
  try {
    const id = req.params.id;

    const invoice = await SampleInvoice.findByPk(id);

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    let filePath = invoice.file;

    /* ---------- Replace File If Uploaded ---------- */
    if (req.file) {
      // delete old file safely
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      filePath = req.file.path;
    }
    await invoice.update({
      name: req.body.name || invoice.name,
      file: filePath
    });

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   DELETE
====================================================== */
exports.deleteSampleInvoice = async (req, res) => {
  try {
    const id = req.params.id;

    const invoice = await SampleInvoice.findByPk(id);

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    // delete file
    if (fs.existsSync(`uploads/sampleInvoices/${invoice.file}`)) {
      fs.unlinkSync(`uploads/sampleInvoices/${invoice.file}`);
    }

    await invoice.destroy();

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.downloadSampleInvoice = async (req, res, next) => {
  try {
    const id = req.params.id;

    const invoice = await SampleInvoice.findByPk(id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    // middleware ko data pass
    req.fileData = invoice;
    return next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Download failed" });
  }
};
