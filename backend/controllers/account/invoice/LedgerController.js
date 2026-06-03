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
  PurchasePoProductsModel
} = db;
const sequelize = db.sequelize;

exports.getOverallPayment = async (req, res) => {
  try {
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

        // Total Invoice Amount
        [fn("COUNT", col("Invoice.id")), "invoiceCount"],
        [fn("SUM", col("InvoiceItems.amount")), "totalInvoice"],

        // Received Amount
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

    const result = company_wise.map((item) => ({
      id: item.id,
      company_name: item.company_name,
      txn: item.invoiceCount,
      totalInvoice: Number(item.totalInvoice || 0),
      receivedAmount: Number(item.receivedAmount || 0),
      outstanding:
        Number(item.totalInvoice || 0) - Number(item.receivedAmount || 0)
    }));

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

    // const avgPaymentDays = await Invoice.findOne({
    //   attributes: [
    //     [
    //       fn("AVG", literal(`DATEDIFF(payment_date, created_at)`)),
    //       "avgPaymentDays"
    //     ]
    //   ],
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
    //     }
    //   ],
    //   where: {
    //     payment_status: "Received"
    //   },
    //   raw: true
    // });

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

    const payment_summary = {
      receivedAmount: Number(customerSummary[0]?.receivedAmount || 0),
      // overdue,
      // avgPaymentDays,
      lastPayment
      // receivedThisMonth
    };

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

    let ledger = [];

    invoicesa?.forEach((invoice) => {
      const amount = Number(invoice.invoice_amount || 0);

      // Invoice Entry
      ledger.push({
        date: invoice.invoice_date,
        voucher_type: "Sales Invoice",
        voucher_no: invoice.invoice_no,
        particulars: `Invoice Created - ${invoice.invoice_no}`,
        debit: 0,
        running_balance: amount,
        credit: 0
      });

      // Payment Entry
      if (invoice.payment_status == "Received" && invoice.payment_date) {
        ledger.push({
          date: invoice.payment_date,
          voucher_type: "Receipt",
          voucher_no: `RCPT-${invoice.invoice_no}`,
          particulars: `Payment Received Against ${invoice.invoice_no}`,
          debit: 0,
          running_balance: 0,
          credit: amount
        });
      }
    });

    res.json({
      customer,
      summary,
      productPurchaseSummary,
      gradeWiseBusiness,
      invoices,
      invoice_history,
      ledger
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
