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
  Supplier
} = db;
const sequelize = db.sequelize;

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

        terms_delivery: invoiceData.terms_delivery,
        remark: invoiceData.remark
      },
      { transaction }
    );

    /* ================= ITEMS ================= */

    const items = products?.map((item) => {
      if (!item.rate) {
        throw new Error("Invalid product data");
      }

      const totalQty = (item.batches || []).reduce(
        (sum, batch) => sum + Number(batch.qty || 0),
        0
      );

      const totalAmount = (item.batches || []).reduce(
        (sum, batch) => sum + Number(batch.amount || 0),
        0
      );

      return {
        bill_id: invoice.id,
        grade: item.grade,
        product_id: item.product_name,
        kind_of_pkgs: item.kind_of_pkgs,
        batch_no: JSON.stringify(item.batches),
        hsn: item.hsn,
        rate: item.rate,
        per: item.per,
        qty: totalQty,
        amount: totalAmount
      };
    });

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

    const items = products?.map((item) => {
      const totalQty = (item.batches || []).reduce(
        (sum, batch) => sum + Number(batch.qty || 0),
        0
      );

      const totalAmount = (item.batches || []).reduce(
        (sum, batch) => sum + Number(batch.amount || 0),
        0
      );

      return {
        bill_id: invoice.id,
        grade: item.grade,
        product_id: item.product_name,
        kind_of_pkgs: item.kind_of_pkgs,
        batch_no: JSON.stringify(item.batches),
        hsn: item.hsn,
        rate: item.rate,
        per: item.per,
        qty: totalQty,
        amount: totalAmount
      };
    });

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
