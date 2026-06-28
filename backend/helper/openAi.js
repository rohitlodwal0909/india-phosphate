const OpenAI = require("openai");
const { where } = require("sequelize");
const db = require("../models");

const {
  Customer,
  PurchaseOrderModel,
  DispatchVehicle,
  Invoice,
  InvoiceItem,
  Product
} = db;

const aiCustomerSummary = async (id) => {
  try {
    const customer = await Customer.findOne({
      attributes: ["company_name", "created_at"],
      where: { id }
    });

    const purchaseOrder = await PurchaseOrderModel.findAll({
      attributes: ["id", "po_no", "created_at", "payment_status"],
      where: {
        company_id: id
      },
      include: [
        {
          model: DispatchVehicle,
          as: "dispatchVehicle",
          attributes: ["id"],
          required: false,
          include: [
            {
              model: Invoice,
              attributes: [
                "id",
                "invoice_no",
                "invoice_date",
                "payment_status"
              ],
              required: false,
              include: [
                {
                  model: InvoiceItem,
                  attributes: ["id", "qty", "amount"],
                  include: [
                    {
                      model: Product,
                      attributes: ["id", "product_name"]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      order: [["created_at", "DESC"]]
    });

    const totalOrders = purchaseOrder.length;

    const lastOrder = purchaseOrder[0];

    const lastOrderDate = lastOrder?.created_at || null;

    const daysSinceLastOrder = lastOrderDate
      ? Math.floor(
          (new Date() - new Date(lastOrderDate)) / (1000 * 60 * 60 * 24)
        )
      : 0;

    let totalBusiness = 0;
    let pendingPayment = 0;
    let lastPaymentDate = null;

    const productMap = {};

    purchaseOrder.forEach((po) => {
      po.dispatchVehicle?.forEach((dispatch) => {
        dispatch.Invoices?.forEach((invoice) => {
          let invoiceAmount = 0;

          invoice.InvoiceItems?.forEach((item) => {
            invoiceAmount += Number(item.amount || 0);

            const product = item.Product?.product_name;

            if (product) {
              productMap[product] =
                (productMap[product] || 0) + Number(item.qty || 0);
            }
          });

          totalBusiness += invoiceAmount;

          if (invoice.payment_status !== "Paid") {
            pendingPayment += invoiceAmount;
          } else {
            if (
              !lastPaymentDate ||
              new Date(invoice.invoice_date) > new Date(lastPaymentDate)
            ) {
              lastPaymentDate = invoice.invoice_date;
            }
          }
        });
      });
    });

    const topProducts = Object.entries(productMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name);

    const recentlyPurchased = lastOrder
      ? [
          ...new Set(
            lastOrder.dispatchVehicle.flatMap((dispatch) =>
              dispatch.Invoices.flatMap((invoice) =>
                invoice.InvoiceItems.map((item) => item.Product.product_name)
              )
            )
          )
        ]
      : [];

    const data = {
      customerName: customer?.company_name,
      customerSince: customer?.created_at,

      lastOrderDate,
      totalOrders,

      totalBusiness,
      pendingPayment,
      lastPaymentDate,

      daysSinceLastOrder,

      topProducts,
      recentlyPurchased,

      stoppedProducts: [], // AI se calculate kara sakte ho
      notes: [] // Meeting/CRM se aayega
    };

    console.log(data);

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const prompt = `
You are a Senior Sales Manager of India Phosphate.

Your job is to help the sales executive prepare for a customer meeting.

Analyze the customer data below and return ONLY valid JSON.

Customer Data:
${JSON.stringify(data, null, 2)}

Return JSON in this format:

{
  "meetingSummary": "",
  "discussionPoints": [],
  "questions": [],
  "risks": [],
  "nextAction": ""
}

Rules:
- Do not invent information.
- Use only the provided ERP data.
- Meeting summary should be less than 100 words.
- Questions should be practical.
`;

    const response = await client.responses.create({
      model: "gpt-5",
      input: prompt
    });

    const aiText = response.output_text;

    console.log("========== AI RESPONSE ==========");
    console.log(aiText);

    // JSON Parse
    let result;
    try {
      result = JSON.parse(aiText);
    } catch (e) {
      console.log("AI returned invalid JSON");
      result = { raw: aiText };
    }

    console.log(result);

    return result;
  } catch (error) {
    console.error("❌ AI Error:", error);
  }
};

module.exports = { aiCustomerSummary };
