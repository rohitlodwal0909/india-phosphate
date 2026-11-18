const CUSTOMER_FIELDS = [
  "company_name",
  "application",
  "company_hq",
  "company_address",
  "customer_type",
  "priority",
  "trader_names",
  "open_field",
  "contacts",
  "addresses",
  "products",
  "gstin",
  "source",
  "sales_person_id",
  "potential_note",
  "potential_status"
];

const getCustomerUpdates = (details = {}) => {
  const updates = {};
  for (const field of CUSTOMER_FIELDS) {
    const rawValue = details[field];
    const value = typeof rawValue === "string" && ["company_name", "company_address", "gstin"].includes(field)
      ? rawValue.trim()
      : rawValue;
    if (value !== undefined && value !== null && value !== "") {
      updates[field] = value;
    }
  }

  if (
    ["Trader", "End Customer", "Open Field"].includes(details.company_type) &&
    !updates.customer_type
  ) {
    updates.customer_type = details.company_type;
  }

  return updates;
};

module.exports = async function syncCustomerMaster({
  Customer,
  companyId,
  details = {},
  userId,
  transaction
}) {
  const options = transaction
    ? { transaction, lock: transaction.LOCK?.UPDATE }
    : {};
  let customer = companyId
    ? await Customer.findByPk(companyId, options)
    : null;

  const updates = getCustomerUpdates(details);

  if (!customer && updates.gstin) {
    customer = await Customer.findOne({
      where: { gstin: updates.gstin },
      paranoid: false,
      ...options
    });
  }

  if (!customer && updates.company_name) {
    customer = await Customer.findOne({
      where: { company_name: updates.company_name.trim() },
      paranoid: false,
      ...options
    });
  }

  if (customer) {
    if (customer.deleted_at && typeof customer.restore === "function") {
      await customer.restore({ transaction });
    }
    if (Object.keys(updates).length) {
      await customer.update(updates, { transaction });
    }
    return customer;
  }

  if (!updates.company_name || !updates.company_address) {
    const error = new Error(
      companyId
        ? "Selected customer was not found in Customer Master."
        : "Customer name and address are required to create a Customer Master entry."
    );
    error.status = companyId ? 404 : 400;
    throw error;
  }

  return Customer.create(
    {
      ...updates,
      company_name: updates.company_name,
      company_address: updates.company_address,
      user_id: userId,
      convert_to_customer: false,
      potential_opportunity: false
    },
    { transaction }
  );
};
