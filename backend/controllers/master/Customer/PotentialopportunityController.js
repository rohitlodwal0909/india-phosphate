const { where } = require("sequelize");
const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { getISTDateTime } = require("../../../helper/dateTimeHelper");
const { Customer, User, PurchaseOrderModel, Product, Notification } = db;

// Create
exports.createOpportunity = async (req, res) => {
  try {
    const customer = await Customer.create({
      company_name: req.body.company_name,
      source: req.body.source,
      company_address: req.body.company_address,
      customer_type: req.body.customer_type,
      trader_names: req.body.trader_names,
      open_field: req.body.open_field,
      contacts: req.body.contacts,
      addresses: req.body.addresses,
      products: req.body.products,
      user_id: req.admin.id,
      potential_opportunity: 1
    });

    res.status(200).json({
      success: true,
      message: "Potential opportunity Created Successfully",
      data: customer
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

// Read By ID
exports.getOpportunity = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      order: [["id", "DESC"]],
      where: {
        potential_opportunity: true
      },
      include: [
        {
          model: User,
          as: "sales_person",
          attributes: ["username"]
        },
        {
          model: User,
          as: "users",
          attributes: ["username"]
        }
      ]
    });

    const formattedCustomers = customers.map((customer) => {
      return {
        ...customer.toJSON(),
        trader_names: customer.trader_names
          ? JSON.parse(customer.trader_names)
          : [],
        contacts: customer.contacts ? JSON.parse(customer.contacts) : [],
        addresses: customer.addresses ? JSON.parse(customer.addresses) : [],
        products: customer.products ? JSON.parse(customer.products) : []
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedCustomers
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// Update
exports.updateOpportunity = async (req, res) => {
  try {
    const {
      id,
      company_name,
      source,
      customer_type,
      trader_names,
      open_field,
      company_address,
      contacts,
      addresses,
      products
    } = req.body;

    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    await customer.update({
      company_name: company_name || "",
      source: source || "",
      customer_type: customer_type || "",
      company_address: company_address || "",
      trader_names: JSON.stringify(trader_names || []),
      open_field: open_field || "",
      contacts: JSON.stringify(contacts || []),
      addresses: JSON.stringify(addresses || []),
      products: JSON.stringify(products || []),
      sales_person_id: req.body.sales_person_id
    });

    const { entry_date, entry_time } = getISTDateTime();

    await Notification.create({
      user_id: req.body.sales_person_id,
      title: "New Opportunity Assigned",
      message: `You have been assigned a new opportunity: ${req.body.company_name}`,
      is_read: 0,
      date_time: `${entry_date} ${entry_time}`
    });

    return res.status(200).json({
      success: true,
      message: "Potential oppertunity updated successfully",
      data: customer
    });
  } catch (error) {
    console.error("Update Customer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

exports.addNote = async (req, res) => {
  try {
    const { id, note } = req.body;

    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    await customer.update({
      potential_note: note || "",
      potential_opportunity: 0
    });

    return res.status(200).json({
      success: true,
      message: "Convert customer successfully",
      data: customer
    });
  } catch (error) {
    console.error("Convert existing customer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
