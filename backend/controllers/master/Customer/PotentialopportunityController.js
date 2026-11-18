const { where } = require("sequelize");
const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { getISTDateTime } = require("../../../helper/dateTimeHelper");
const { Customer, User, PurchaseOrderModel, Product, Notification } = db;

const parseJsonField = (value) => {
  if (!value) return [];
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
};

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

// Import potential customers from validated Excel rows parsed by the client.
exports.importOpportunities = async (req, res) => {
  try {
    const rows = req.body.rows;
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ success: false, message: "Excel file has no importable rows." });
    }

    const allowedTypes = new Set(["Trader", "End Customer", "Open Field"]);
    const invalidRows = [];
    const customers = rows.map((row, index) => {
      const rowNumber = index + 2;
      const companyName = String(row.company_name || "").trim();
      const source = String(row.source || "").trim();
      const companyAddress = String(row.company_address || "").trim();
      const customerType = String(row.customer_type || "").trim();
      const traderNames = Array.isArray(row.trader_names) ? row.trader_names : [];
      const contacts = Array.isArray(row.contacts) ? row.contacts : [];
      const addresses = Array.isArray(row.addresses) ? row.addresses : [];
      const products = Array.isArray(row.products) ? row.products : [];

      if (!companyName || !source || !companyAddress || !allowedTypes.has(customerType)) {
        invalidRows.push(rowNumber);
      } else {
        const hasIncompleteContact = contacts.some((contact) => {
          const person = String(contact.person || "").trim();
          const email = String(contact.email || "").trim();
          const number = String(contact.number || "").trim();
          return !person || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email) || !/^[0-9]{10}$/.test(number);
        });
        const hasIncompleteAddress = addresses.some((address) =>
          !String(address.factory_address || "").trim() || !String(address.city || "").trim() || !String(address.country || "").trim()
        );
        const hasIncompleteProduct = products.some((product) =>
          !String(product.product || "").trim() || !String(product.grade || "").trim()
        );
        if ((customerType === "Trader" && !traderNames.some((name) => String(name).trim())) ||
          (customerType === "Open Field" && !String(row.open_field || "").trim()) ||
          hasIncompleteContact || hasIncompleteAddress || hasIncompleteProduct) {
          invalidRows.push(rowNumber);
        }
      }

      return {
        company_name: companyName,
        source,
        company_address: companyAddress,
        customer_type: customerType,
        trader_names: traderNames,
        open_field: String(row.open_field || "").trim(),
        contacts,
        addresses,
        products,
        note: String(row.note || "").trim(),
        user_id: req.admin.id,
        potential_opportunity: true
      };
    });

    if (invalidRows.length) {
      return res.status(400).json({
        success: false,
        message: `Required fields or Customer Type are invalid in Excel row(s): ${invalidRows.join(", ")}. No rows were saved.`
      });
    }

    const savedCustomers = await Customer.bulkCreate(customers, { validate: true });
    return res.status(201).json({
      success: true,
      message: `${savedCustomers.length} potential customer(s) imported successfully.`,
      imported_count: savedCustomers.length
    });
  } catch (error) {
    console.error("Import Potential Opportunities Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Unable to import potential customers."
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
        trader_names: parseJsonField(customer.trader_names),
        contacts: parseJsonField(customer.contacts),
        addresses: parseJsonField(customer.addresses),
        products: parseJsonField(customer.products)
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
    const { id, note, status } = req.body;

    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }
    const check = status == "Close" ? 1 : 0;

    await customer.update({
      potential_note: note || "",
      potential_status: status,
      potential_opportunity: check
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
