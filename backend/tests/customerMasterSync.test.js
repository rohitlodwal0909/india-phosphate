const assert = require("node:assert/strict");
const { after, test } = require("node:test");

const savedModules = new Map();
const modelsPath = require.resolve("../models");
const notificationPath = require.resolve("../helper/SendNotification");

const existingCustomer = {
  id: 7,
  company_name: "Existing Company",
  company_address: "Old address",
  note: "Keep this customer-only note",
  async update(values) {
    Object.assign(this, values);
  }
};
const createdCustomers = [];
const savedRecords = { enquiries: [], developments: [], samples: [], purchaseOrders: [] };
let nextId = 100;

const record = (collection, values) => {
  const saved = { id: nextId++, ...values };
  collection.push(saved);
  return saved;
};

const db = {
  Customer: {
    async findByPk(id) {
      return String(id) === String(existingCustomer.id)
        ? existingCustomer
        : createdCustomers.find((customer) => String(customer.id) === String(id)) || null;
    },
    async findOne({ where }) {
      return [...createdCustomers, existingCustomer].find((customer) =>
        Object.entries(where).every(([field, value]) => {
          if (field === "company_name") {
            return String(customer[field] || "").trim().toLowerCase() === String(value).trim().toLowerCase();
          }
          return customer[field] === value;
        })
      ) || null;
    },
    async create(values) {
      const customer = record(createdCustomers, values);
      customer.update = async (updates) => Object.assign(customer, updates);
      return customer;
    }
  },
  EnquiryModel: {
    async findOne() { return null; },
    async create(values) { return record(savedRecords.enquiries, values); },
    async findByPk() { return null; }
  },
  EnquiryIntrestedProductsModel: { async bulkCreate() {}, async destroy() {} },
  DevelopmentModel: {
    async create(values) { return record(savedRecords.developments, values); },
    async findByPk() { return null; }
  },
  DevelopmentIntrestedProductsModel: { async bulkCreate() {}, async destroy() {} },
  SampleRequestModel: {
    async findOne() { return null; },
    async create(values) { return record(savedRecords.samples, values); },
    async findByPk() { return null; }
  },
  SampleProductsModel: { async bulkCreate() {}, async destroy() {} },
  PurchaseOrderModel: {
    async findOne() { return null; },
    async findByPk() { return { id: 1, company_id: 7 }; },
    async create(values) { return record(savedRecords.purchaseOrders, values); }
  },
  WorkOrderModel: { async findOne() { return null; }, async create() {} },
  Notification: { async create() {} },
  sequelize: {
    async transaction(callback) {
      return callback({ LOCK: { UPDATE: "UPDATE" } });
    }
  }
};

const installMock = (modulePath, exports) => {
  savedModules.set(modulePath, require.cache[modulePath]);
  require.cache[modulePath] = {
    id: modulePath,
    filename: modulePath,
    loaded: true,
    exports,
    children: [],
    paths: []
  };
};

installMock(modelsPath, db);
installMock(notificationPath, { createNotificationByRoleId: async () => {} });

const enquiryController = require("../controllers/marketing/Enquiry/EnquiryController");
const developmentController = require("../controllers/marketing/development/DevelopmentController");
const sampleRequestController = require("../controllers/marketing/Sample/SampleRequestController");
const purchaseOrderController = require("../controllers/marketing/PO/PurchaseOrderController");
const syncCustomerMaster = require("../helper/syncCustomerMaster");

after(() => {
  for (const [modulePath, previous] of savedModules) {
    if (previous) require.cache[modulePath] = previous;
    else delete require.cache[modulePath];
  }
});

const invoke = async (handler, body, files = undefined) => {
  const res = {
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.payload = payload; return this; }
  };
  await handler({ body, files, admin: { id: 3 }, params: {} }, res);
  assert.equal(res.statusCode, 200, JSON.stringify(res.payload));
  return res.payload;
};

test("Enquiry creation retains the selected Customer Master relationship", async () => {
  await invoke(enquiryController.storeEnquiry, { company_id: "7", products: [] });
  assert.equal(savedRecords.enquiries.at(-1).company_id, 7);
});

test("Development Enquiry creation retains the selected Customer Master relationship", async () => {
  await invoke(developmentController.storeDevelopment, { company_id: "7", products: [] });
  assert.equal(savedRecords.developments.at(-1).company_id, 7);
});

test("Any Other Enquiry (Sample Request) retains the selected Customer Master relationship", async () => {
  await invoke(sampleRequestController.storeSampleRequest, {
    company_id: "7",
    items: "[]"
  }, []);
  assert.equal(savedRecords.samples.at(-1).company_id, 7);
});

test("Purchase Order creation links the selected customer and syncs supplied customer fields", async () => {
  await invoke(purchaseOrderController.storePurchaseOrder, {
    company_id: "7",
    company_address: "Updated PO address",
    company_type: "Trader",
    po_no: "PO-TEST-1",
    products: "[]"
  }, []);
  assert.equal(savedRecords.purchaseOrders.at(-1).company_id, 7);
  assert.equal(existingCustomer.company_address, "Updated PO address");
  assert.equal(existingCustomer.customer_type, "Trader");
  assert.equal(existingCustomer.note, "Keep this customer-only note");
});

test("Enquiry creation adds a customer when complete customer details are supplied", async () => {
  await invoke(enquiryController.storeEnquiry, {
    company_name: "Enquiry Company",
    company_address: "Enquiry address",
    gstin: "GST-ENQUIRY",
    products: []
  });
  assert.equal(savedRecords.enquiries.at(-1).company_id, createdCustomers.at(-1).id);
  assert.equal(createdCustomers.at(-1).company_name, "Enquiry Company");
});

test("Customer Master sync reuses GST/name matches instead of duplicating a customer", async () => {
  const initialCustomerCount = createdCustomers.length;
  const matchedCustomer = await syncCustomerMaster({
    Customer: db.Customer,
    details: {
      company_name: "  Existing Company ",
      company_address: "Updated PO address",
      gstin: "GST-EXISTING"
    },
    userId: 3
  });
  assert.equal(matchedCustomer.id, existingCustomer.id);
  assert.equal(createdCustomers.length, initialCustomerCount);

  const created = await syncCustomerMaster({
    Customer: db.Customer,
    details: {
      company_name: "New Company",
      company_address: "New address",
      gstin: "GST-NEW"
    },
    userId: 3
  });
  const reused = await syncCustomerMaster({
    Customer: db.Customer,
    details: {
      company_name: "Different label",
      company_address: "Updated address",
      gstin: "GST-NEW"
    },
    userId: 4
  });
  assert.equal(reused.id, created.id);
  assert.equal(createdCustomers.length, initialCustomerCount + 1);
  assert.equal(created.company_address, "Updated address");
});
