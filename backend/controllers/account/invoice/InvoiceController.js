const { where } = require("sequelize");
const db = require("../../../models");
const {
  PurchaseOrderModel,
  Customer,
  User,
  DispatchVehicle,
  Invoice,
  InvoiceItem,
  InvoicePaymentFollowup,
  Product,
  RmCode,
  PmCode,
  Equipment,
  DispatchBatch,
  Qcbatch
} = db;
const sequelize = db.sequelize;

const resolveInvoiceItemMaster = async (item, transaction) => {
  const category = item.item_category || "Product";
  const masterId = Number(item.master_item_id || item.product_name);
  const masterConfig = {
    RM: { model: RmCode, nameField: "name" },
    PM: { model: PmCode, nameField: "name" },
    Equipment: { model: Equipment, nameField: "name" },
    Product: { model: Product, nameField: "product_name" }
  }[category];

  if (!masterConfig || !Number.isInteger(masterId) || masterId <= 0) {
    const error = new Error("Select a valid category and master item for every invoice row.");
    error.status = 400;
    throw error;
  }

  const masterItem = await masterConfig.model.findByPk(masterId, { transaction });
  if (!masterItem) {
    const error = new Error(`Selected ${category} master item was not found.`);
    error.status = 400;
    throw error;
  }

  return {
    item_category: category,
    master_item_id: masterId,
    item_name: masterItem[masterConfig.nameField],
    product_id: category === "Product" ? masterId : null
  };
};

const prepareInvoiceItems = async (products, transaction) => Promise.all(products.map(async (item) => {
  if (!item.rate) {
    const error = new Error("Invalid product data");
    error.status = 400;
    throw error;
  }

  const masterFields = await resolveInvoiceItemMaster(item, transaction);
  const batches = Array.isArray(item.batches) ? item.batches : [];
  const totalQty = batches.reduce((sum, batch) => sum + Number(batch.qty || 0), 0);
  const totalAmount = batches.reduce((sum, batch) => sum + Number(batch.amount || 0), 0);

  return {
    ...masterFields,
    grade: item.grade,
    kind_of_pkgs: item.kind_of_pkgs,
    batch_no: JSON.stringify(batches),
    hsn: item.hsn,
    rate: item.rate,
    per: item.per,
    qty: totalQty,
    amount: totalAmount
  };
}));

exports.getEntryInvoice = async (req, res) => {
  try {
    const { status } = req.query;

    let condition = {};

    if (status == 1) {
      condition = { invoice_type: "domestic" };
    } else if (status == 2) {
      condition = { invoice_type: "export" };
    }

    const data = await Invoice.findAll({
      where: condition,

      include: [
        {
          model: DispatchVehicle,
          where: { deleted_at: null },
          include: [
            {
              model: DispatchBatch,
              as: "batches",
              include: [
                {
                  model: Qcbatch,
                  as: "batch",
                  attributes: [
                    ["id", "batch_id"],
                    ["qc_batch_number", "batch_no"]
                  ]
                }
              ]
            },
            {
              model: PurchaseOrderModel,
              as: "poentry",
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
        }
      ]
    });

    // const data = await DispatchVehicle.findAll({
    //   include: [
    //     {
    //       model: DispatchBatch,
    //       as: "batches",
    //       include: [
    //         {
    //           model: Qcbatch,
    //           as: "batch",
    //           attributes: [
    //             ["id", "batch_id"],
    //             ["qc_batch_number", "batch_no"]
    //           ]
    //         }
    //       ]
    //     },
    //     {
    //       model: PurchaseOrderModel,
    //       as: "poentry",
    //       where: condition,
    //       include: [
    //         {
    //           model: User,
    //           as: "users",
    //           attributes: ["id", "username"]
    //         },
    //         {
    //           model: Customer,
    //           as: "customers"
    //         }
    //       ]
    //     },
    //     {
    //       model: Invoice,
    //       required: true
    //     }
    //   ]
    // });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDispatchPo = async (req, res) => {
  try {
    const { status } = req.query;

    let condition = {};

    if (status == 1) {
      condition = { domestic: true };
    } else if (status == 2) {
      condition = { export: true };
    }

    const data = await DispatchVehicle.findAll({
      order: [["created_at", "DESC"]],
      attributes: ["id", "po_id", "lr_no", "dispatch_date"],
      include: [
        {
          model: DispatchBatch,
          as: "batches",
          include: [
            {
              model: Qcbatch,
              as: "batch",
              attributes: [
                ["id", "batch_id"],
                ["qc_batch_number", "batch_no"]
              ]
            }
          ]
        },
        {
          model: PurchaseOrderModel,
          as: "poentry",
          where: condition,
          attributes: [
            "po_no",
            "po_date",
            "created_at",
            "company_id",
            "customer_name",
            "company_address"
          ],
          include: [
            {
              model: Customer,
              as: "customers",
              attributes: ["company_name"]
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
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Invoice No & Date required"
      });
    }

    if (!products || !products.length) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "At least one product required"
      });
    }

    const preparedItems = await prepareInvoiceItems(products, transaction);

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
        currency: invoiceData.currency || "INR",

        terms_delivery: invoiceData.terms_delivery,
        remark: invoiceData.remark
      },
      { transaction }
    );

    /* ================= ITEMS ================= */

    const items = preparedItems.map((item) => ({ ...item, invoice_id: invoice.id }));

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

    return res.status(error.status || 500).json({
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

    if (!Array.isArray(products) || products.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: "At least one product required" });
    }

    const preparedItems = await prepareInvoiceItems(products, transaction);

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

    const items = preparedItems.map((item) => ({ ...item, invoice_id: invoice.id }));

    await InvoiceItem.bulkCreate(items, { transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: "Invoice updated successfully"
    });
  } catch (error) {
    await transaction.rollback();
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

exports.getInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Invoice.findOne({
      where: {
        id: id
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

exports.getInvoicepayment = async (req, res) => {
  try {
    const data = await Invoice.findAll({
      order: [["id", "DESC"]],
      attributes: [
        "id",
        "dispatch_id",
        "payment_status",
        "account_payment_remark",
        "invoice_no",
        "invoice_date",
        "received_amount",
        "account_payment_status",
        "currency"
      ],
      include: [
        { model: InvoiceItem, attributes: ["amount"] },
        { model: InvoicePaymentFollowup, as: "paymentFollowups", attributes: ["id", "note", "follow_up_date", "created_at"], required: false },
        {
          model: DispatchVehicle,
          attributes: ["id", "dispatch_date"],
          where: { deleted_at: null },
          include: [
            {
              model: PurchaseOrderModel,
              as: "poentry",
              attributes: ["id", "po_no", "payment_terms", "expected_delivery_date"],
              include: [
                {
                  model: Customer,
                  as: "customers",
                  attributes: ["company_name"]
                }
              ]
            }
          ]
        }
      ]
    });

    res.json(data.map((invoice) => {
      const row = invoice.toJSON();
      row.actual_amount = (row.InvoiceItems || []).reduce((total, item) => total + Number(item.amount || 0), 0);
      row.paymentFollowups = (row.paymentFollowups || []).sort((a, b) =>
        String(b.follow_up_date).localeCompare(String(a.follow_up_date))
      );
      return row;
    }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateInvoiceReceivedAmount = async (req, res) => {
  try {
    const invoiceId = Number(req.params.id);
    const receivedAmount = Number(req.body.received_amount);
    if (!Number.isInteger(invoiceId) || invoiceId <= 0 || !Number.isFinite(receivedAmount) || receivedAmount < 0) {
      return res.status(400).json({ message: "Enter a valid received amount." });
    }
    const invoice = await Invoice.findByPk(invoiceId, { include: [{ model: InvoiceItem, attributes: ["amount"] }] });
    if (!invoice) return res.status(404).json({ message: "Invoice not found." });
    const actualAmount = invoice.InvoiceItems.reduce((total, item) => total + Number(item.amount || 0), 0);
    const receivedCents = Math.round(receivedAmount * 100);
    const actualCents = Math.round(actualAmount * 100);
    if (receivedCents > actualCents) {
      return res.status(400).json({ message: "Received amount cannot exceed the invoice amount." });
    }
    const paymentStatus = receivedCents === 0 ? "Pending" : receivedCents === actualCents ? "Paid" : "Partially Paid";
    await invoice.update({ received_amount: (receivedCents / 100).toFixed(2), account_payment_status: paymentStatus });
    return res.json({ message: "Received amount updated.", received_amount: Number(invoice.received_amount), account_payment_status: paymentStatus });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.addInvoicePaymentFollowup = async (req, res) => {
  try {
    const invoiceId = Number(req.params.id);
    const note = String(req.body.note || "").trim();
    const followUpDate = String(req.body.follow_up_date || "").trim();
    if (!Number.isInteger(invoiceId) || invoiceId <= 0 || !note || !/^\d{4}-\d{2}-\d{2}$/.test(followUpDate)) {
      return res.status(400).json({ message: "A note and valid follow-up date are required." });
    }
    const invoice = await Invoice.findByPk(invoiceId);
    if (!invoice) return res.status(404).json({ message: "Invoice not found." });
    const followup = await InvoicePaymentFollowup.create({ invoice_id: invoiceId, note, follow_up_date: followUpDate });
    return res.status(201).json(followup);
  } catch (error) {
    return res.status(500).json({ message: error.message });
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

exports.getDispatchBatches = async (req, res) => {
  try {
    const batches = await DispatchVehicle.findAll({
      attributes: ["product_name"],
      include: [
        {
          model: DispatchBatch,
          as: "batches",
          attributes: [],
          include: [
            {
              model: Qcbatch,
              as: "batch",
              attributes: [
                ["id", "batch_id"],
                ["qc_batch_number", "batch_no"]
              ]
            }
          ]
        }
      ],
      raw: true
    });

    const result = batches.map((item) => ({
      batch_id: item["batches.batch.batch_id"],
      batch_no: item["batches.batch.batch_no"],
      product_name: item.product_name
    }));

    res.json(result);
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
