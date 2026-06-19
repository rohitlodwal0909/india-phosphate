const { Op, fn, col, literal, where } = require("sequelize");
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
  PurchasePoModel,
  PurchasePoProductsModel,
  BillModel,
  BillModelItem
} = db;
const sequelize = db.sequelize;

exports.getOverallPayment = async (req, res) => {
  try {
    // Data Get
    const data = await Invoice.findAll({
      attributes: [
        "id",
        "payment_status",
        [fn("SUM", col("InvoiceItems.amount")), "totalAmount"]
      ],
      include: [
        {
          model: InvoiceItem,
          attributes: []
        }
      ],
      group: ["Invoice.id"],
      raw: true
    });

    const company_wise = await Invoice.findAll({
      attributes: [
        [col("DispatchVehicle.poentry.customers.id"), "id"],
        [col("DispatchVehicle.poentry.customers.company_name"), "company_name"],
        [fn("COUNT", col("Invoice.id")), "invoiceCount"],
        [fn("SUM", col("InvoiceItems.amount")), "totalInvoice"],
        [
          fn(
            "SUM",
            literal(`
                CASE
                  WHEN Invoice.payment_status = 'Received'
                  THEN InvoiceItems.amount
                  ELSE 0
                END
              `)
          ),
          "receivedAmount"
        ]
      ],

      include: [
        {
          model: DispatchVehicle,
          attributes: [],
          where: { deleted_at: null },
          include: [
            {
              model: PurchaseOrderModel,
              as: "poentry",
              attributes: [],
              include: [
                {
                  model: Customer,
                  as: "customers",
                  attributes: []
                }
              ]
            }
          ]
        },
        {
          model: InvoiceItem,
          attributes: []
        }
      ],
      group: [
        "DispatchVehicle.poentry.customers.id",
        "DispatchVehicle.poentry.customers.company_name"
      ],
      raw: true
    });

    const debitCreditData = await BillModel.findAll({
      attributes: [
        "company_id",

        [
          fn(
            "SUM",
            literal(`
          CASE
            WHEN transaction_type = 'credit'
            THEN CAST(BillModelItems.amount AS DECIMAL(18,2))
            ELSE 0
          END
        `)
          ),
          "creditAmount"
        ],

        [
          fn(
            "SUM",
            literal(`
          CASE
            WHEN transaction_type = 'debit'
            THEN CAST(BillModelItems.amount AS DECIMAL(18,2))
            ELSE 0
          END
        `)
          ),
          "debitAmount"
        ]
      ],

      where: {
        party_type: "Customer"
      },

      include: [
        {
          model: BillModelItem,
          attributes: []
        }
      ],

      group: ["BillModel.company_id"],
      raw: true
    });

    const billMap = {};

    debitCreditData.forEach((item) => {
      billMap[item.company_id] = {
        creditAmount: Number(item.creditAmount || 0),
        debitAmount: Number(item.debitAmount || 0)
      };
    });

    const result = company_wise.map((item) => {
      const bill = billMap[item.id] || {};

      const totalInvoice = Number(item.totalInvoice || 0);
      const receivedAmount = Number(item.receivedAmount || 0);

      const creditAmount = Number(bill.creditAmount || 0);
      const debitAmount = Number(bill.debitAmount || 0);

      return {
        id: item.id,
        company_name: item.company_name,
        txn: Number(item.invoiceCount || 0),
        totalInvoice: Number(item.totalInvoice || 0),
        receivedAmount: receivedAmount + creditAmount,
        outstanding:
          totalInvoice + debitAmount - (receivedAmount + creditAmount),

        creditAmount: creditAmount,
        debitAmount: debitAmount,
        finalOutstanding:
          totalInvoice - receivedAmount + debitAmount + creditAmount
      };
    });

    const topOutstandingCompanies = result
      .filter((item) => item.outstanding > 0)
      .sort((a, b) => b.outstanding - a.outstanding)
      .slice(0, 5);

    const purchase = await PurchasePoModel.findAll({
      attributes: [
        "id",
        "payment_status",
        [fn("SUM", col("purchasePo.total")), "totalAmount"]
      ],
      include: [
        {
          model: PurchasePoProductsModel,
          as: "purchasePo",
          attributes: []
        }
      ],
      group: ["PurchasePoModel.id"],
      raw: true
    });

    const product_wise = await Invoice.findAll({
      attributes: [
        [col("InvoiceItems.Product.id"), "product_id"],
        [col("InvoiceItems.Product.product_name"), "product_name"],
        [fn("SUM", col("InvoiceItems.amount")), "totalAmount"]
      ],
      include: [
        {
          model: InvoiceItem,
          attributes: [],
          include: [
            {
              model: Product,
              as: "Product",
              attributes: []
            }
          ]
        }
      ],

      group: ["InvoiceItems.Product.id", "InvoiceItems.Product.product_name"],

      raw: true
    });

    const grade_wise = await Invoice.findAll({
      attributes: [
        [col("InvoiceItems.grade"), "grade"],
        [fn("SUM", col("InvoiceItems.qty")), "totalQty"],
        [fn("SUM", col("InvoiceItems.amount")), "totalAmount"]
      ],

      include: [
        {
          model: InvoiceItem,
          attributes: []
        }
      ],

      group: ["InvoiceItems.grade"],

      raw: true
    });

    const total_credit = data
      .filter((data) => data.payment_status == "Received")
      .reduce((sum, item) => sum + parseFloat(item.totalAmount || 0), 0);

    const invoice_value = data.reduce(
      (sum, item) => sum + parseFloat(item.totalAmount || 0),
      0
    );

    const total_debit = purchase
      .filter((data) => data.payment_status == "Paid")
      .reduce((sum, item) => sum + parseFloat(item.totalAmount || 0), 0);

    const total_po = purchase.reduce(
      (sum, item) => sum + parseFloat(item.totalAmount || 0),
      0
    );

    res.json({
      invoice_value,
      total_credit,
      total_debit,
      total_po,
      company_wise: result,
      product_wise,
      grade_wise,
      topOutstandingCompanies
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCustomerLedger = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findOne({
      where: { id: id }
    });

    const customerSummary = await Invoice.findAll({
      attributes: [
        [fn("COUNT", col("Invoice.id")), "invoiceCount"],
        [fn("SUM", col("InvoiceItems.amount")), "totalInvoice"],

        [
          fn(
            "SUM",
            literal(`
          CASE
            WHEN Invoice.payment_status = 'Received'
            THEN InvoiceItems.amount
            ELSE 0
          END
        `)
          ),
          "receivedAmount"
        ]
      ],

      include: [
        {
          model: DispatchVehicle,
          attributes: [],
          where: { deleted_at: null },
          include: [
            {
              model: PurchaseOrderModel,
              as: "poentry",
              attributes: [],
              where: { company_id: id }
            }
          ]
        },
        {
          model: InvoiceItem,
          attributes: []
        }
      ],

      raw: true
    });

    const productPurchaseSummary = await Invoice.findAll({
      attributes: [
        [col("InvoiceItems.Product.id"), "product_id"],
        [col("InvoiceItems.Product.product_name"), "product_name"],

        [fn("SUM", col("InvoiceItems.qty")), "totalQty"],
        [fn("SUM", col("InvoiceItems.amount")), "totalAmount"]
      ],

      include: [
        {
          model: DispatchVehicle,
          attributes: [],
          include: [
            {
              model: PurchaseOrderModel,
              as: "poentry",
              attributes: [],
              where: { company_id: id }
            }
          ]
        },
        {
          model: InvoiceItem,
          attributes: [],
          include: [
            {
              model: Product,
              attributes: []
            }
          ]
        }
      ],

      group: ["InvoiceItems.Product.id", "InvoiceItems.Product.product_name"],

      raw: true
    });

    const purchaseOrder = await PurchaseOrderModel.findAll({
      attributes: ["id", "po_no", "created_at", "payment_status", "products"],
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

    const productIds = [
      ...new Set(
        purchaseOrder.flatMap((po) => {
          const products =
            typeof po.products === "string"
              ? JSON.parse(po.products || "[]")
              : po.products || [];

          return products.map((item) => item.product_id);
        })
      )
    ];

    const productMasters = await Product.findAll({
      where: {
        id: productIds
      },
      attributes: ["id", "product_name"],
      raw: true
    });

    const productMap = {};

    productMasters.forEach((product) => {
      productMap[product.id] = product.product_name;
    });

    const purchaseOrders = purchaseOrder.map((po) => {
      const products =
        typeof po.products === "string"
          ? JSON.parse(po.products || "[]")
          : po.products || [];

      const productDetails = products.map((item) => ({
        product_name: productMap[item.product_id] || "-",
        qty: Number(item.quantity || 0),
        amount: Number(item.total || 0)
      }));

      // Invoice Numbers
      const invoiceNos =
        po.dispatchVehicle
          ?.map((dispatch) => dispatch.Invoice?.invoice_no)
          .filter(Boolean) || [];

      // Total Invoice Amount
      const invoiceAmount =
        po.dispatchVehicle?.reduce((sum, dispatch) => {
          const items = dispatch.Invoice?.InvoiceItems || [];

          return (
            sum +
            items.reduce(
              (itemSum, item) => itemSum + Number(item.amount || 0),
              0
            )
          );
        }, 0) || 0;

      return {
        po_no: po.po_no,
        po_date: po.created_at,
        payment_status: po.payment_status,

        invoice_no: invoiceNos.join(", "),

        product_count: products.length,

        total_qty: productDetails.reduce(
          (sum, p) => sum + Number(p.qty || 0),
          0
        ),

        total_amount: productDetails.reduce(
          (sum, p) => sum + Number(p.amount || 0),
          0
        ),

        invoice_amount: invoiceAmount,

        products: productDetails
      };
    });

    const gradeWiseBusiness = await Invoice.findAll({
      attributes: [
        [col("InvoiceItems.grade"), "grade"],

        [fn("SUM", col("InvoiceItems.qty")), "totalQty"],
        [fn("SUM", col("InvoiceItems.amount")), "totalAmount"]
      ],

      include: [
        {
          model: DispatchVehicle,
          attributes: [],
          include: [
            {
              model: PurchaseOrderModel,
              as: "poentry",
              attributes: [],
              where: { company_id: id }
            }
          ]
        },
        {
          model: InvoiceItem,
          attributes: []
        }
      ],

      group: ["InvoiceItems.grade"],

      raw: true
    });

    const paidInvoice = await Invoice.count({
      where: {
        payment_status: "Received"
      },
      include: [
        {
          model: DispatchVehicle,
          attributes: [],
          where: { deleted_at: null },
          include: [
            {
              model: PurchaseOrderModel,
              as: "poentry",
              attributes: [],
              where: { company_id: id }
            }
          ]
        }
      ]
    });

    const pendingInvoice = await Invoice.count({
      where: {
        payment_status: ["Pending", "Notreceived"]
      },
      include: [
        {
          model: DispatchVehicle,
          attributes: [],
          where: { deleted_at: null },
          include: [
            {
              model: PurchaseOrderModel,
              as: "poentry",
              attributes: [],
              where: { company_id: id }
            }
          ]
        }
      ]
    });

    const lastInvoice = await Invoice.findOne({
      attributes: ["id", "invoice_no", "invoice_date", "payment_status"],

      include: [
        {
          model: DispatchVehicle,
          attributes: [],
          where: { deleted_at: null },
          include: [
            {
              model: PurchaseOrderModel,
              as: "poentry",
              attributes: [],
              where: { company_id: id }
            }
          ]
        }
      ],

      order: [["id", "DESC"]],
      raw: true
    });

    const summary = {
      invoiceCount: Number(customerSummary[0]?.invoiceCount || 0),
      totalInvoice: Number(customerSummary[0]?.totalInvoice || 0),
      receivedAmount: Number(customerSummary[0]?.receivedAmount || 0),
      outstanding:
        Number(customerSummary[0]?.totalInvoice || 0) -
        Number(customerSummary[0]?.receivedAmount || 0)
    };

    summary.outstanding =
      summary.totalInvoice +
      summary.debitAmount -
      summary.receivedAmount -
      summary.creditAmount;

    const overdue = await Invoice.findAll({
      attributes: [[fn("SUM", col("InvoiceItems.amount")), "overdueAmount"]],
      include: [
        {
          model: InvoiceItem,
          attributes: []
        }
      ],
      where: {
        payment_status: "Pending",
        invoice_date: { [Op.lt]: new Date() } // overdue
      },
      raw: true
    });

    const lastPayment = await Invoice.findOne({
      attributes: ["payment_date"],
      include: [
        {
          model: DispatchVehicle,
          attributes: [],
          include: [
            {
              model: PurchaseOrderModel,
              as: "poentry",
              attributes: [],
              where: { company_id: id }
            }
          ]
        }
      ],
      where: {
        payment_status: "Received"
      },
      order: [["payment_date", "DESC"]],
      raw: true
    });

    const lastPurchase = await PurchaseOrderModel.findOne({
      attributes: ["created_at"],
      where: { company_id: id },
      order: [["created_at", "DESC"]]
    });

    // const receivedThisMonth = await Invoice.findOne({
    //   attributes: [[fn("SUM", col("InvoiceItems.amount")), "amount"]],
    //   include: [
    //     {
    //       model: DispatchVehicle,
    //       attributes: [],
    //       include: [
    //         {
    //           model: PurchaseOrderModel,
    //           as: "poentry",
    //           attributes: [],
    //           where: { company_id: id }
    //         }
    //       ]
    //     },
    //     {
    //       model: InvoiceItem,
    //       attributes: []
    //     }
    //   ],
    //   where: {
    //     payment_status: "Received",
    //     payment_date: {
    //       [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    //     }
    //   },
    //   raw: true
    // });

    const invoices = { paidInvoice, pendingInvoice, lastInvoice };

    const invoice_history = await Invoice.findAll({
      attributes: [
        "id",
        "invoice_no",
        "payment_status",
        "invoice_date",
        "delivery_note_date"
      ],

      include: [
        {
          model: DispatchVehicle,
          attributes: [],
          where: { deleted_at: null },
          include: [
            {
              model: PurchaseOrderModel,
              as: "poentry",
              attributes: ["po_no"],
              where: { company_id: id }
            }
          ]
        },
        {
          model: InvoiceItem,
          attributes: ["amount"],
          include: [
            {
              model: Product,
              attributes: ["product_name"]
            }
          ]
        }
      ],

      raw: true
    });

    const invoicesa = await Invoice.findAll({
      attributes: [
        "id",
        "invoice_no",
        "invoice_date",
        "payment_date",
        "payment_status",
        [
          sequelize.fn("SUM", sequelize.col("InvoiceItems.amount")),
          "invoice_amount"
        ]
      ],

      include: [
        {
          model: DispatchVehicle,
          attributes: [],
          required: true,
          where: { deleted_at: null },
          include: [
            {
              model: PurchaseOrderModel,
              as: "poentry",
              attributes: [],
              where: { company_id: id }
            }
          ]
        },
        {
          model: InvoiceItem,
          attributes: []
        }
      ],

      group: ["Invoice.id"],

      raw: true
    });

    const bills = await BillModel.findAll({
      where: { company_id: id, party_type: "Customer" },
      attributes: [
        "id",
        "invoice_no",
        "invoice_date",
        "payment_date",
        "payment_status",
        "transaction_type",
        [
          sequelize.fn("SUM", sequelize.col("BillModelItems.amount")),
          "invoice_amount"
        ]
      ],
      include: [
        {
          model: BillModelItem,
          attributes: []
        }
      ],
      group: ["BillModel.id"],
      raw: true
    });

    let ledger = [];

    // Sales Invoice
    invoicesa.forEach((invoice) => {
      const amount = Number(invoice.invoice_amount || 0);

      ledger.push({
        date: invoice.invoice_date,
        voucher_type: "Sales Invoice",
        voucher_no: invoice.invoice_no,
        particulars: `Invoice Created - ${invoice.invoice_no}`,
        debit: 0,
        credit: 0,
        running_balance: amount
      });

      if (invoice.payment_status === "Received" && invoice.payment_date) {
        ledger.push({
          date: invoice.payment_date,
          voucher_type: "Receipt",
          voucher_no: `RCPT-${invoice.invoice_no}`,
          particulars: `Payment Received Against ${invoice.invoice_no}`,
          debit: 0,
          credit: amount,
          running_balance: 0
        });
      }
    });

    // Debit / Credit Notes
    bills.forEach((bill) => {
      const amount = Number(bill.invoice_amount || 0);

      if (bill.transaction_type?.toLowerCase() === "debit") {
        ledger.push({
          date: bill.invoice_date,
          voucher_type: "Debit Note",
          voucher_no: bill.invoice_no,
          particulars: `Debit Note - ${bill.invoice_no}`,
          debit: amount,
          credit: 0
        });
      }

      if (bill.transaction_type?.toLowerCase() === "credit") {
        ledger.push({
          date: bill.invoice_date,
          voucher_type: "Credit Note",
          voucher_no: bill.invoice_no,
          particulars: `Credit Note - ${bill.invoice_no}`,
          debit: 0,
          credit: amount
        });
      }
    });

    const analytics = {
      averageOrderValue:
        summary.invoiceCount > 0
          ? summary.totalInvoice / summary.invoiceCount
          : 0,

      highestInvoice: Math.max(
        ...(invoicesa || []).map((item) => Number(item.invoice_amount || 0)),
        0
      ),

      highestProduct: "-",
      purchaseFrequency: 0,
      avgPaymentCycle: 0,
      businessGrowth: 0
    };

    const productSummary = {};

    purchaseOrders.forEach((po) => {
      po.products?.forEach((product) => {
        productSummary[product.product_name] =
          (productSummary[product.product_name] || 0) +
          Number(product.qty || 0);
      });
    });

    analytics.highestProduct =
      Object.entries(productSummary).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

    const poDates = purchaseOrders
      .map((x) => new Date(x.po_date))
      .sort((a, b) => a - b);

    if (poDates.length > 1) {
      let totalGap = 0;

      for (let i = 1; i < poDates.length; i++) {
        totalGap += (poDates[i] - poDates[i - 1]) / (1000 * 60 * 60 * 24);
      }

      analytics.purchaseFrequency = Math.round(totalGap / (poDates.length - 1));
    }
    let totalDays = 0;
    let paidCount = 0;

    invoicesa.forEach((invoice) => {
      if (invoice.payment_status === "Received" && invoice.payment_date) {
        totalDays +=
          (new Date(invoice.payment_date) - new Date(invoice.invoice_date)) /
          (1000 * 60 * 60 * 24);

        paidCount++;
      }
    });

    analytics.avgPaymentCycle =
      paidCount > 0 ? Math.round(totalDays / paidCount) : 0;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    let currentSales = 0;
    let previousSales = 0;

    invoicesa.forEach((invoice) => {
      const amount = Number(invoice.invoice_amount || 0);
      const d = new Date(invoice.invoice_date);

      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        currentSales += amount;
      }

      if (
        d.getMonth() === currentMonth - 1 &&
        d.getFullYear() === currentYear
      ) {
        previousSales += amount;
      }
    });

    analytics.businessGrowth =
      previousSales > 0
        ? Number(
            (((currentSales - previousSales) / previousSales) * 100).toFixed(2)
          )
        : 0;

    res.json({
      customer,
      purchaseOrders,
      analytics,
      summary,
      productPurchaseSummary,
      gradeWiseBusiness,
      invoices,
      invoice_history,
      ledger,
      lastPayment,
      lastPurchase
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
