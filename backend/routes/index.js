const express = require("express");
const router = express.Router();

const authRoutes = require("../routes/authentication/AuthRoutes");
const permissionRoutes = require("../routes/authentication/PermissionRoutes");
const userRoutes = require("../routes/usermanagment/UserRoutes");
const guardRoutes = require("../routes/inventory/GuardEntryRoutes");
const grnRoutes = require("../routes/inventory/GrnEntryRoutes");
const qaQcRoutes = require("../routes/inventory/QaqcRoutes");
const dispatchRoutes = require("../routes/inventory/DispatchRoutes");
const productionRoutes = require("../routes/inventory/ProdutionRoutes");
const supplierRoutes = require("../routes/master/SupplierRoutes");
const StaffMasterRoutes = require("../routes/master/StaffMasterRoutes");
const RmCodeRoutes = require("../routes/master/RmCodeRoutes");
const PmCodeRoutes = require("../routes/master/PmCodeRoutes");
const customerRoutes = require("../routes/master/CustomerRoutes");
const NotificationRouter = require("../routes/notification/NotificationRoutes");
const categoryRoutes = require("../routes/master/CategoryRoutes");
const StateRoutes = require("../routes/master/StateRoutes");
const CityRoutes = require("../routes/master/CityRoutes");
const DesignationRoutes = require("../routes/master/DesignationRoutes");
const InwardRoutes = require("../routes/master/InwardRoutes");
const QualificationRoutes = require("../routes/master/QualificationRoutes");
const UnitRoutes = require("../routes/master/UnitRoutes");
const CompanyRoutes = require("../routes/master/CompanyRoutes");
const DepartmentMasterRoutes = require("../routes/master/DepartmentMasterRoutes");
const MakeMasterRoutes = require("../routes/master/MakeMasterRoutes");
const AccountRoutes = require("../routes/master/AccountRoutes");
const PackingMaterialRoutes = require("../routes/master/PackingMaterialRoutes");
const TransportRoutes = require("../routes/master/TransportRoutes");
const BatchMasterRoutes = require("../routes/master/BatchMasterRoutes");
const PendingOrderRoutes = require("../routes/master/PendingOrderRoutes");
const StockMasterRoutes = require("../routes/master/StockMasterRoutes");
const SalesMasterRoutes = require("../routes/master/SalesMasterRoutes");
const HsnMasterRoutes = require("../routes/master/HsnMasterRoutes");
const CurrencyRoutes = require("../routes/master/CurrencyRoutes");
const EquipmentRoutes = require("../routes/master/EquipmentRoutes");
const OutwardRoutes = require("../routes/master/OutwardRoutes");
const PurchaseRoutes = require("../routes/master/PurchaseRoutes");
const BmrMasterRoutes = require("../routes/master/BmrMasterRoutes");
const FinishGoodRoutes = require("../routes/master/FinishGoodRoutes");
const FormulaRoutes = require("../routes/master/FormulaRoutes");
const DocumentRoutes = require("../routes/master/DocumentRoutes");
const ProductRoutes = require("../routes/master/ProductRoutes");

const FprRoutes = require("../routes/inventory/FprRoutes");
const BmrRoutes = require("../routes/inventory/BmrRecordRoutes");
const IssuedRoutes = require("../routes/inventory/InventoryIssuedRoutes");
const BmrReports = require("../routes/inventory/BmrReportRoutes");
const ReplacementRoutes = require("../routes/inventory/ReplacementRoutes");
const ProductionPlaningRoutes = require("../routes/inventory/ProductionPlaningRoutes");

const ManufacturingProcedureRoutes = require("../routes/master/ManufacturingProcedureRoutes");
const GrnMasterRoutes = require("../routes/master/GrnMasterRoutes");
const PurchaseOrderRoutes = require("../routes/marketing/PurchaseOrderRoutes");
const EnquiryRoutes = require("../routes/marketing/EnquiryRoutes");
const AuditRoutes = require("../routes/marketing/AuditRoutes");
const SampleRequestRoutes = require("../routes/marketing/SampleRequestRoutes");

const InvoiceRoutes = require("../routes/account/InvoiceRoutes");
const ExportInvoiceRoutes = require("../routes/account/ExportInvoiceRoutes");
const PackingListRoutes = require("../routes/account/PackingListRoutes");
const DraftPackingRoutes = require("../routes/account/DraftPackingRoutes");
const SampleInvoiceRoutes = require("../routes/account/SampleInvoiceRoutes");

const authMiddleware = require("../middleware/authMiddleware");

// Purchase
const QuotationRoutes = require("../routes/purchase/QuotationRoutes");
const PurchaseStoreRoutes = require("../routes/purchase/PurchaseStoreRoutes");
const PoRequisitionRoutes = require("../routes/purchase/PoRequisitionRoutes");
const PoPurchaseRoutes = require("../routes/purchase/PoPurchaseRoutes");

router.use("/api", authRoutes);
router.use("/api", authMiddleware, BmrRoutes);
router.use("/api", userRoutes);
router.use("/api", guardRoutes);
router.use("/api", grnRoutes);
router.use("/api", authMiddleware, qaQcRoutes);
router.use("/api", authMiddleware, dispatchRoutes);
router.use("/api", authMiddleware, ProductRoutes);
router.use("/api", productionRoutes);
router.use("/api", supplierRoutes);
router.use("/api", categoryRoutes);
router.use("/api", UnitRoutes);
router.use("/api", RmCodeRoutes);
router.use("/api", PmCodeRoutes);
router.use("/api", authMiddleware, customerRoutes);
router.use("/api", permissionRoutes);
router.use("/api", authMiddleware, NotificationRouter);
router.use("/api", StaffMasterRoutes);
router.use("/api", DesignationRoutes);
router.use("/api", InwardRoutes);
router.use("/api", QualificationRoutes);
router.use("/api", StateRoutes);
router.use("/api", CityRoutes);
router.use("/api", CompanyRoutes);
router.use("/api", MakeMasterRoutes);
router.use("/api", DepartmentMasterRoutes);
router.use("/api", AccountRoutes);
router.use("/api", PackingMaterialRoutes);
router.use("/api", TransportRoutes);
router.use("/api", BatchMasterRoutes);
router.use("/api", PendingOrderRoutes);
router.use("/api", StockMasterRoutes);
router.use("/api", SalesMasterRoutes);
router.use("/api", HsnMasterRoutes);
router.use("/api", HsnMasterRoutes);
router.use("/api", CurrencyRoutes);
router.use("/api", EquipmentRoutes);
router.use("/api", OutwardRoutes);
router.use("/api", PurchaseRoutes);
router.use("/api", BmrMasterRoutes);
router.use("/api", FinishGoodRoutes);
router.use("/api", authMiddleware, FormulaRoutes);
router.use("/api", DocumentRoutes);
router.use("/api", authMiddleware, FprRoutes);
router.use("/api", IssuedRoutes);
router.use("/api", BmrReports);
router.use("/api", ManufacturingProcedureRoutes);
router.use("/api", authMiddleware, GrnMasterRoutes);
router.use("/api", authMiddleware, PurchaseOrderRoutes);
router.use("/api", authMiddleware, ReplacementRoutes);
router.use("/api", authMiddleware, ProductionPlaningRoutes);

// Account Routes
router.use("/api", authMiddleware, InvoiceRoutes);
router.use("/api", authMiddleware, ExportInvoiceRoutes);
router.use("/api", authMiddleware, PackingListRoutes);
router.use("/api", authMiddleware, DraftPackingRoutes);
router.use("/api", authMiddleware, SampleInvoiceRoutes);

// Purchase
router.use("/api", authMiddleware, QuotationRoutes);
router.use("/api", authMiddleware, PurchaseStoreRoutes);
router.use("/api", authMiddleware, PoRequisitionRoutes);
router.use("/api", authMiddleware, PoPurchaseRoutes);

router.use("/api", authMiddleware, EnquiryRoutes);
router.use("/api", authMiddleware, AuditRoutes);
router.use("/api", authMiddleware, SampleRequestRoutes);

module.exports = router;
