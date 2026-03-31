const { where } = require("sequelize");
const db = require("../../../models");
const {
  PurchaseOrderModel,
  Customer,
  User,
  DispatchVehicle,
  Invoice,
  InvoiceItem,
  Product
} = db;
const sequelize = db.sequelize;
const fs = require("fs");
const path = require("path");

exports.getEntryInvoice = async (req, res) => {
  try {
    const { status } = req.query;

    let condition = {};

    if (status == 1) {
      condition = { domestic: true };
    } else if (status == 2) {
      condition = { export: true };
    }

    const data = await DispatchVehicle.findAll({
      include: [
        {
          model: PurchaseOrderModel,
          as: "poentry",
          where: condition,
          include: [
            {
              model: User,
              as: "users",
              attributes: ["id", "username"]
            },
            {
              model: Customer,
              as: "customers"
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

exports.createInvoice = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    /* ================= PARSE FORM DATA ================= */

    // when sent via FormData → comes as string
    const invoiceData =
      typeof req.body.invoiceData === "string"
        ? JSON.parse(req.body.invoiceData)
        : req.body.invoiceData;

    const products =
      typeof req.body.products === "string"
        ? JSON.parse(req.body.products)
        : req.body.products;

    /* ================= VALIDATION ================= */

    if (!invoiceData?.invoice_no || !invoiceData?.invoice_date) {
      return res.status(400).json({
        success: false,
        message: "Invoice No & Date required"
      });
    }

    if (!products || !products.length) {
      return res.status(400).json({
        success: false,
        message: "At least one product required"
      });
    }

    /* ================= FILE HANDLE ================= */

    const oq_upload = req.file ? req.file.filename : null;

    /* ================= CREATE INVOICE ================= */

    /* ================= GST FIX ================= */

    let gstValue = [];

    if (invoiceData.gst) {
      gstValue = JSON.stringify(invoiceData.gst);
    }

    const invoice = await Invoice.create(
      {
        dispatch_id: invoiceData.dispatch_id,
        invoice_type: invoiceData.invoice_type,
        invoice_no: invoiceData.invoice_no,
        invoice_date: invoiceData.invoice_date,
        eway_bill: invoiceData.eway_bill,
        delivery_note: invoiceData.delivery_note,
        delivery_note_date: invoiceData.delivery_note_date,

        oq_upload, // ✅ SAFE

        irn: invoiceData.irn,
        ack_no: invoiceData.ack_no,
        ack_date: invoiceData.ack_date,

        buyer: invoiceData.buyer,
        consignee: invoiceData.consignee,
        gst_type: invoiceData.gst_type,

        payment_mode: invoiceData.payment_mode,
        payment_remark: invoiceData.payment_remark,

        reference_no: invoiceData.reference_no,
        other_reference: invoiceData.other_reference,
        buyer_order_no: invoiceData.buyer_order_no,
        buyer_order_date: invoiceData.buyer_order_date,

        dispatch_doc_no: invoiceData.dispatch_doc_no,
        dispatch_through: invoiceData.dispatch_through,
        destination: invoiceData.destination,
        country: invoiceData.country,

        lut_no: invoiceData.lut_no,
        from_to: invoiceData.from_to,

        gst: gstValue,
        freight: invoiceData.freight,
        round_off: invoiceData.round_off,
        insurance: invoiceData.insurance,

        terms_delivery: invoiceData.terms_delivery,
        remark: invoiceData.remark
      },
      { transaction }
    );

    /* ================= ITEMS ================= */

    const items = products.map((item) => {
      if (!item.product_name || !item.qty || !item.rate) {
        throw new Error("Invalid product data");
      }

      return {
        invoice_id: invoice.id,
        product_id: item.product_name,
        kind_of_pkgs: item.kind_of_pkgs,
        batch_no: JSON.stringify(item.batches),
        hsn: item.hsn,
        rate: item.rate,
        per: item.per
      };
    });

    await InvoiceItem.bulkCreate(items, { transaction });

    /* ================= COMMIT ================= */

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: invoice
    });
  } catch (error) {
    await transaction.rollback();

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateInvoice = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    const invoiceData = JSON.parse(req.body.invoiceData);
    const products = JSON.parse(req.body.products);

    if (invoiceData.gst) {
      invoiceData.gst = JSON.stringify(invoiceData.gst);
    }

    if (req.file) {
      invoiceData.oq_upload = req.file.filename;
    }

    const invoice = await Invoice.findByPk(id);

    await invoice.update(invoiceData, { transaction });

    await InvoiceItem.destroy({
      where: { invoice_id: id },
      transaction
    });

    const items = products.map((item) => ({
      invoice_id: id,
      product_id: item.product_name,
      kind_of_pkgs: item.kind_of_pkgs,
      batch_no: JSON.stringify(item.batches),
      hsn: item.hsn,
      rate: item.rate,
      per: item.per
    }));

    await InvoiceItem.bulkCreate(items, { transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: "Invoice updated successfully"
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Invoice.findOne({
      where: {
        dispatch_id: id
      },
      include: [
        {
          model: InvoiceItem,
          include: [
            {
              model: Product
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

exports.getInvoices = async (req, res) => {
  try {
    const data = await Invoice.findAll({ order: [["id", "DESC"]] });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadEwayPdf = async (req, res) => {
  try {
    const { invoice_id } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File required" });
    }

    const filePath = req.file.path;

    await Invoice.update({ eway_pdf: filePath }, { where: { id: invoice_id } });

    res.json({
      message: "PDF uploaded successfully",
      file: filePath
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
};
