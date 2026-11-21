const { where } = require("sequelize");
const db = require("../../../models");
const {
  PurchaseOrderModel,
  Customer,
  User,
  DispatchVehicle,
  Invoice,
  InvoiceItem,
  Product,
  DispatchBatch,
  Qcbatch,
  BillModel,
  BillModelItem,
  Supplier,
  RmCode,
  PmCode,
  Equipment
} = db;
const sequelize = db.sequelize;

const resolveBillItemMaster = async (item) => {
  const category = item.item_category || "Product";
  const masterId = Number(item.master_item_id || item.product_name);
  const masterConfig = {
    RM: { model: RmCode, nameField: "name" },
    PM: { model: PmCode, nameField: "name" },
    Equipment: { model: Equipment, nameField: "name" },
    Product: { model: Product, nameField: "product_name" }
  }[category];

  if (!masterConfig || !Number.isInteger(masterId) || masterId <= 0) {
    const error = new Error("Select a valid category and master item for every bill row.");
    error.status = 400;
    throw error;
  }

  const masterItem = await masterConfig.model.findByPk(masterId);
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

const prepareBillItems = async (billId, products) => Promise.all(products.map(async (item) => {
  if (!item.rate) throw new Error("Invalid product data");
  const masterFields = await resolveBillItemMaster(item);
  const batches = Array.isArray(item.batches) ? item.batches : [];
  const totalQty = batches.reduce((sum, batch) => sum + Number(batch.qty || 0), 0);
  const totalAmount = batches.reduce((sum, batch) => sum + Number(batch.amount || 0), 0);

  return {
    bill_id: billId,
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

exports.getBills = async (req, res) => {
  try {
    const data = await BillModel.findAll({
      include: [
        {
          model: Customer,
          attributes: ["id", "company_name"]
        },
        {
          model: Supplier,
          attributes: ["id", "supplier_name"]
        }
      ]
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBill = async (req, res) => {
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

    const invoice = await BillModel.create(
      {
        company_id: invoiceData.company_id || null,
        party_type: invoiceData.party_type || null,
        transaction_type: invoiceData.transaction_type || null,

        invoice_type: invoiceData.invoice_type,
        po_no: invoiceData.po_no,
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

    const items = await prepareBillItems(invoice.id, products);

    await BillModelItem.bulkCreate(items, { transaction });

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

exports.updateBill = async (req, res) => {
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

    const invoice = await BillModel.findByPk(id);

    await invoice.update(invoiceData, { transaction });

    await BillModelItem.destroy({
      where: { bill_id: id },
      transaction
    });

    const items = await prepareBillItems(invoice.id, products);

    await BillModelItem.bulkCreate(items, { transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: "Invoice Bill updated successfully"
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSingleBill = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await BillModel.findOne({
      where: {
        id: id
      },
      include: [
        {
          model: BillModelItem,
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
