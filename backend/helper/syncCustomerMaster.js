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

const parseList = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
};

const normalizedText = (value) => String(value ?? "").trim().toLowerCase();

const mergeUnique = (existing, incoming, keyFor) => {
  const result = [];
  const seen = new Set();
  for (const item of [...parseList(existing), ...parseList(incoming)]) {
    if (!item || typeof item !== "object") continue;
    const key = keyFor(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
};

const getContact = (details) => {
  const person = details.contact_person || details.person || details.contact_name;
  const email = details.contact_email || details.email;
  const number = details.mobile || details.contact_number || details.number;
  return person || email || number ? [{ person: person || "", email: email || "", number: number || "" }] : [];
};

const normalizeProducts = (products) => parseList(products).map((product) => ({
  ...product,
  product: product.product ?? product.product_id ?? product.product_name ?? product.name ?? "",
  grade: product.grade || ""
})).filter((product) => product.product !== "");

const mergeMasterLists = (customer, updates) => {
  const next = { ...updates };
  const contacts = mergeUnique(customer?.contacts, [...parseList(updates.contacts), ...getContact(updates)], (contact) => {
    const number = normalizedText(contact.number || contact.mobile || contact.phone);
    const email = normalizedText(contact.email);
    const person = normalizedText(contact.person || contact.contact_person || contact.name);
    return number || email || person;
  });
  const products = mergeUnique(customer?.products, normalizeProducts(updates.products), (product) => {
    const id = product.product ?? product.product_id ?? product.product_name ?? product.name;
    return `${normalizedText(id)}|${normalizedText(product.grade)}`;
  });
  if (contacts.length || updates.contacts !== undefined || getContact(updates).length) next.contacts = contacts;
  if (products.length || updates.products !== undefined) next.products = products;
  return next;
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
    const mergedUpdates = mergeMasterLists(customer, updates);
    if (Object.keys(mergedUpdates).length) {
      await customer.update(mergedUpdates, { transaction });
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
      ...mergeMasterLists(null, updates),
      company_name: updates.company_name,
      company_address: updates.company_address,
      user_id: userId,
      convert_to_customer: false,
      potential_opportunity: false
    },
    { transaction }
  );
};
