const db = require("../../../models");
const { PurchasePoModel, BillModel, BillModelItem, BillPaymentFollowup, Customer, Supplier } = db;

const getBillTotal = (bill) => (bill.BillModelItems || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);

exports.getPurchaseAccounts = async (_req, res) => {
  try {
    const [orders, bills] = await Promise.all([
      PurchasePoModel.findAll({ order: [["id", "DESC"]] }),
      BillModel.findAll({
        order: [["id", "DESC"]],
        include: [
          { model: BillModelItem, attributes: ["amount"] },
          { model: BillPaymentFollowup, as: "paymentFollowups", attributes: ["id", "note", "follow_up_date", "created_at"], required: false },
          { model: Customer, attributes: ["company_name"], required: false },
          { model: Supplier, attributes: ["supplier_name"], required: false }
        ]
      })
    ]);

    const keyFor = (poNo) => String(poNo || "").trim().toLowerCase();
    const billsByPo = new Map();
    bills.forEach((bill) => {
      const key = keyFor(bill.po_no);
      if (!key) return;
      if (!billsByPo.has(key)) billsByPo.set(key, []);
      const row = bill.toJSON();
      row.actual_amount = getBillTotal(row);
      row.payment_amount = Number(row.payment_amount || 0);
      row.purchase_payment_status = row.payment_amount <= 0 ? "Pending" : row.payment_amount >= row.actual_amount ? "Paid" : "Partially Paid";
      row.paymentFollowups = (row.paymentFollowups || []).sort((a, b) => String(b.follow_up_date).localeCompare(String(a.follow_up_date)));
      billsByPo.get(key).push(row);
    });

    const linkedBills = new Set();
    const result = [];
    orders.forEach((orderInstance) => {
      const order = orderInstance.toJSON();
      const linked = billsByPo.get(keyFor(order.po_no)) || [];
      if (!linked.length) {
        result.push({
          purchase_order: order,
          bill: null,
          material_received: false,
          actual_amount: 0,
          payment_amount: 0,
          outstanding: 0,
          payment_status: "Pending"
        });
        return;
      }
      linked.forEach((bill) => {
        linkedBills.add(bill.id);
        const actual = Number(bill.actual_amount || 0);
        const paid = Number(bill.payment_amount || 0);
        result.push({ purchase_order: order, bill, material_received: true, actual_amount: actual, payment_amount: paid, outstanding: Math.max(0, actual - paid), payment_status: bill.purchase_payment_status });
      });
    });

    // Keep bills whose PO was deleted or no longer exists visible to Accounts.
    bills.forEach((billInstance) => {
      const bill = billInstance.toJSON();
      if (linkedBills.has(bill.id)) return;
      bill.actual_amount = getBillTotal(bill);
      const actual = Number(bill.actual_amount || 0);
      const paid = Number(bill.payment_amount || 0);
      const status = paid <= 0 ? "Pending" : paid >= actual ? "Paid" : "Partially Paid";
      result.push({ purchase_order: null, bill, material_received: true, actual_amount: actual, payment_amount: paid, outstanding: Math.max(0, actual - paid), payment_status: status });
    });

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updatePaymentAmount = async (req, res) => {
  try {
    const billId = Number(req.params.id);
    const amount = Number(req.body.payment_amount);
    if (!Number.isInteger(billId) || billId <= 0 || !Number.isFinite(amount) || amount < 0) {
      return res.status(400).json({ message: "Enter a valid payment amount." });
    }
    const bill = await BillModel.findByPk(billId, { include: [{ model: BillModelItem, attributes: ["amount"] }] });
    if (!bill) return res.status(404).json({ message: "Bill not found." });
    const actual = getBillTotal(bill);
    const amountCents = Math.round(amount * 100);
    const actualCents = Math.round(actual * 100);
    if (amountCents > actualCents) return res.status(400).json({ message: "Payment amount cannot exceed the actual bill amount." });
    const paymentStatus = amountCents === 0 ? "Pending" : amountCents === actualCents ? "Paid" : "Partially Paid";
    await bill.update({ payment_amount: (amountCents / 100).toFixed(2), purchase_payment_status: paymentStatus });
    return res.json({ message: "Payment amount updated.", payment_amount: Number(bill.payment_amount), payment_status: paymentStatus });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.addFollowup = async (req, res) => {
  try {
    const billId = Number(req.params.id);
    const note = String(req.body.note || "").trim();
    const date = String(req.body.follow_up_date || "").trim();
    const parsedDate = new Date(`${date}T00:00:00.000Z`);
    if (!Number.isInteger(billId) || billId <= 0 || !note || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date) {
      return res.status(400).json({ message: "A note and valid follow-up date are required." });
    }
    const bill = await BillModel.findByPk(billId);
    if (!bill) return res.status(404).json({ message: "Bill not found." });
    return res.status(201).json(await BillPaymentFollowup.create({ bill_id: billId, note, follow_up_date: date }));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
