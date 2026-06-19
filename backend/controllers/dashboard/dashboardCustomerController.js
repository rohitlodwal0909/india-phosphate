const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../../models");
const { Op, where, fn, col, literal } = require("sequelize");

const {
  Customer,
  PurchaseOrderModel,
  DispatchVehicle,
  DisputeModel,
  EnquiryModel,
  SampleRequestModel,
  Product,
  QuotationModel,
  EnquiryIntrestedProductsModel
} = db;

const getProductMap = async () => {
  const products = await Product.findAll({
    attributes: ["id", "product_name"]
  });

  return products.reduce((acc, item) => {
    acc[item.id] = item.product_name;
    return acc;
  }, {});
};

const parseProducts = (products) => {
  try {
    return JSON.parse(products || "[]");
  } catch {
    return [];
  }
};

const calculateTotalValue = (orders) =>
  orders.reduce(
    (sum, po) =>
      sum +
      parseProducts(po.products).reduce((s, p) => s + Number(p.total || 0), 0),
    0
  );

const calculateBuyingCycle = (orders) => {
  if (orders.length < 2) return 0;

  const totalDays = orders.slice(1).reduce((sum, order, index) => {
    const prev = new Date(orders[index].created_at);
    const curr = new Date(order.created_at);

    return sum + Math.ceil((curr - prev) / (1000 * 60 * 60 * 24));
  }, 0);

  return Number((totalDays / (orders.length - 1)).toFixed(1));
};

const getProductWiseData = (orders, productMap) => {
  const totals = {};

  orders.forEach((po) => {
    parseProducts(po.products).forEach((product) => {
      const id = product.product_id;

      if (!totals[id]) {
        totals[id] = {
          product_id: id,
          product_name: productMap[id] || "Unknown Product",
          grade: product.grade,
          totalQuantity: 0,
          totalAmount: 0
        };
      }

      totals[id].totalQuantity += Number(product.quantity || 0);
      totals[id].totalAmount += Number(product.total || 0);
    });
  });

  return Object.values(totals);
};

const getGradeWiseData = (orders) => {
  const totals = {};

  orders.forEach((po) => {
    parseProducts(po.products).forEach((product) => {
      const grade = product.grade || "N/A";

      if (!totals[grade]) {
        totals[grade] = {
          grade,
          totalQuantity: 0,
          totalAmount: 0
        };
      }

      totals[grade].totalQuantity += Number(product.quantity || 0);
      totals[grade].totalAmount += Number(product.total || 0);
    });
  });

  return Object.values(totals);
};

const customerdata = async () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  const fyStart =
    currentMonth >= 4
      ? new Date(currentYear, 3, 1) // 1 Apr current year
      : new Date(currentYear - 1, 3, 1); // 1 Apr previous year

  const fyEnd =
    currentMonth >= 4
      ? new Date(currentYear + 1, 2, 31, 23, 59, 59)
      : new Date(currentYear, 2, 31, 23, 59, 59);

  const fy_value = await PurchaseOrderModel.findAll({
    where: {
      created_at: {
        [Op.between]: [fyStart, fyEnd]
      }
    },
    attributes: ["products"]
  });

  const pos = await PurchaseOrderModel.findAll({
    attributes: ["products", "created_at", "company_address"],
    order: [["created_at", "ASC"]]
  });

  const fyTotalValue = calculateTotalValue(fy_value);
  // buyingCycle
  const buyingCycle = calculateBuyingCycle(pos);

  let totalQuantity = 0;
  pos.forEach((po) => {
    const products = JSON.parse(po.products || "[]");

    products.forEach((product) => {
      totalQuantity += Number(product.total || 0);
    });
  });

  const totalOrders = pos.length;

  const avgOrderValue =
    totalOrders > 0 ? Number((totalQuantity / totalOrders).toFixed(2)) : 0;

  const productMap = await getProductMap();

  const productWiseData = getProductWiseData(pos, productMap);

  const gradeWiseData = getGradeWiseData(pos);

  const expectedOrders = buyingCycle ? Math.floor(365 / buyingCycle) : 0;

  const potentialRevenue = avgOrderValue * expectedOrders;

  const companies = await Customer.findAll({
    order: [["created_at", "DESC"]]
  });

  let dormantCustomers = 0;
  let revivedCustomers = 0;

  for (const company of companies) {
    const lastOrder = await PurchaseOrderModel.findOne({
      where: {
        company_id: company.id
      },
      order: [["created_at", "DESC"]]
    });

    if (!lastOrder) continue;
    const daysSinceLastOrder = Math.floor(
      (Date.now() - new Date(lastOrder.created_at)) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastOrder > 180) {
      dormantCustomers++;
    }

    let isRevived = false;

    for (let i = 1; i < lastOrder.length; i++) {
      const previousDate = new Date(lastOrder[i - 1].created_at);
      const currentDate = new Date(lastOrder[i].created_at);

      const gapDays = Math.floor(
        (currentDate - previousDate) / (1000 * 60 * 60 * 24)
      );

      if (gapDays > 180) {
        isRevived = true;
        break;
      }
    }

    if (isRevived) {
      revivedCustomers++;
    }
  }

  const recoveryRate =
    dormantCustomers > 0
      ? Number(((revivedCustomers / dormantCustomers) * 100).toFixed(2))
      : 0;

  const enquiry = await EnquiryModel.count();

  const order = await PurchaseOrderModel.count();
  const conversionRate = enquiry > 0 ? ((order / enquiry) * 100).toFixed(2) : 0;

  const contacted = await Customer.count({
    where: { convert_to_customer: 1 },
    order: [["created_at", "DESC"]]
  });

  const quotation = await QuotationModel.count();
  const sample = await SampleRequestModel.count();

  const lost = await EnquiryModel.findAll({
    include: [
      { model: EnquiryIntrestedProductsModel, as: "interested_products" }
    ]
  });

  const closedCount = lost.reduce((count, enquiry) => {
    try {
      const followups = JSON.parse(enquiry.followups || "[]");

      if (!followups.length) return count;

      const lastFollowup = followups[followups.length - 1];

      return lastFollowup.status?.toLowerCase() === "closed"
        ? count + 1
        : count;
    } catch (error) {
      return count;
    }
  }, 0);

  const customer_conversation = {
    identifiedCompanies: companies.length,
    contacted,
    enquiry,
    quotation,
    sample,
    order,
    lost: closedCount
  };

  const revivalQueue = [];

  const customers = await Customer.findAll({
    where: {
      convert_to_customer: 1
    }
  });

  for (const customer of customers) {
    const orders = await PurchaseOrderModel.findAll({
      where: {
        company_id: customer.id
      },
      order: [["created_at", "DESC"]]
    });

    if (!orders.length) continue;

    const lastOrder = orders[0];

    const daysSinceLastOrder = Math.floor(
      (Date.now() - new Date(lastOrder.created_at).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    // Total Revenue
    let totalRevenue = 0;

    orders.forEach((po) => {
      const products = JSON.parse(po.products || "[]");

      products.forEach((item) => {
        totalRevenue += Number(item.total || 0);
      });
    });

    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    const priority =
      daysSinceLastOrder > 120 && avgOrderValue > 1000000
        ? "High"
        : daysSinceLastOrder > 90
          ? "Medium"
          : "Low";

    // Sirf dormant customers queue me
    if (daysSinceLastOrder > 90) {
      revivalQueue.push({
        customer_id: customer.id,
        company_name: customer.company_name,
        days: daysSinceLastOrder,
        potential: Math.round(avgOrderValue),
        priority
      });
    }
  }

  return {
    fyTotalValue,
    buyingCycle,
    avgOrderValue,
    productWiseData,
    gradeWiseData,
    potentialRevenue,
    dormantCustomers,
    conversionRate,
    revivedCustomers,
    recoveryRate,
    customer_conversation,
    customersRevenueMap: pos,
    revivalQueue
  };
};

exports.getallCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.findAll({
      order: [["created_at", "DESC"]]
    });

    const total_orders = await PurchaseOrderModel.count();

    const pending_orders = await PurchaseOrderModel.count({
      include: [
        {
          model: DispatchVehicle,
          as: "dispatchVehicle",
          required: false,
          attributes: []
        }
      ],
      where: {
        "$dispatchVehicle.id$": null
      }
    });

    const total_disputes = await DisputeModel.findAll({
      order: [["created_at", "DESC"]]
    });

    const count = total_disputes.filter((dispute) => {
      const followups = JSON.parse(dispute?.followups || "[]");

      return !followups.some(
        (item) => item?.status?.toLowerCase() === "closed"
      );
    }).length;

    const customer = await customerdata();

    res.status(200).json({
      message: "customers fetched successfully",
      customers,
      total_orders,
      pending_orders,
      total_disputes: count,
      customer
    });
  } catch (error) {
    next(error);
  }
};

exports.getCustomerDashboard = async (req, res, next) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findOne({
      where: { id: id },
      attributes: ["id", "company_name", "addresses", "created_at"]
    });

    const enquiry = await EnquiryModel.count({
      where: {
        company_id: id
      }
    });

    const sample = await SampleRequestModel.count({
      where: {
        company_id: id
      }
    });

    const order = await PurchaseOrderModel.count({
      where: {
        company_id: id
      }
    });

    const pos = await PurchaseOrderModel.findAll({
      where: {
        company_id: id
      },
      attributes: ["products", "created_at"],
      order: [["created_at", "ASC"]]
    });

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    const fyStart =
      currentMonth >= 4
        ? new Date(currentYear, 3, 1) // 1 Apr current year
        : new Date(currentYear - 1, 3, 1); // 1 Apr previous year

    const fyEnd =
      currentMonth >= 4
        ? new Date(currentYear + 1, 2, 31, 23, 59, 59)
        : new Date(currentYear, 2, 31, 23, 59, 59);

    const fy_value = await PurchaseOrderModel.findAll({
      where: {
        company_id: id,
        created_at: {
          [Op.between]: [fyStart, fyEnd]
        }
      },
      attributes: ["products"]
    });

    let totalQuantity = 0;

    pos.forEach((po) => {
      const products = JSON.parse(po.products || "[]");

      products.forEach((product) => {
        totalQuantity += Number(product.total || 0);
      });
    });

    let fyTotalValue = 0;

    fy_value.forEach((po) => {
      const products = JSON.parse(po.products || "[]");

      products.forEach((product) => {
        fyTotalValue += Number(product.total || 0);
      });
    });

    const totalOrders = pos.length;

    const avgOrderValue =
      totalOrders > 0 ? Number((totalQuantity / totalOrders).toFixed(2)) : 0;

    const lastOrder = await PurchaseOrderModel.findOne({
      where: {
        company_id: id
      },
      order: [["created_at", "DESC"]],
      attributes: ["id", "created_at"]
    });

    const lastOrderDate = lastOrder?.created_at || null;

    const buyingCycle = calculateBuyingCycle(pos);

    // Product lookup map
    const productMap = await getProductMap();

    const productWiseData = getProductWiseData(pos, productMap);

    const gradeWiseData = getGradeWiseData(pos);

    const expectedOrders = buyingCycle ? Math.floor(365 / buyingCycle) : 0;

    const potentialRevenue = avgOrderValue * expectedOrders;

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const annualDemandPOs = await PurchaseOrderModel.findAll({
      where: {
        company_id: id,
        created_at: {
          [Op.gte]: oneYearAgo
        }
      },
      attributes: ["products"]
    });

    let annualDemand = 0;

    annualDemandPOs.forEach((po) => {
      const products = JSON.parse(po.products || "[]");

      products.forEach((product) => {
        annualDemand += Number(product.quantity || 0);
      });
    });

    await res.status(200).json({
      customer,
      enquiry,
      sample,
      order,
      po_value: totalQuantity,
      fyTotalValue,
      avgOrderValue,
      lastOrder,
      buyingCycle,
      productWiseData,
      gradeWiseData,
      potentialRevenue,
      annualDemand
    });
  } catch (error) {
    next(error);
  }
};

exports.getDormantCustomer = async (req, res, next) => {
  try {
    const date = new Date();
    date.setDate(date.getDate() - 180);

    const customers = await Customer.findAll({
      where: {
        created_at: {
          [Op.lte]: date
        }
      },
      order: [["created_at", "DESC"]]
    });

    res.status(200).json({
      message: "Dormant customers fetched successfully",
      customers
    });
  } catch (error) {
    next(error);
  }
};

exports.getPendingOrder = async (req, res, next) => {
  try {
    const pending_orders = await PurchaseOrderModel.findAll({
      attributes: [
        "id",
        "po_no",
        "company_id",
        "expected_delivery_date",
        "priority"
      ],
      include: [
        {
          model: DispatchVehicle,
          as: "dispatchVehicle",
          required: false,
          attributes: []
        },
        {
          model: Customer,
          as: "customers",
          attributes: ["company_name"]
        }
      ],
      where: {
        "$dispatchVehicle.id$": null
      }
    });

    res.status(200).json(pending_orders);
  } catch (error) {
    next(error);
  }
};
