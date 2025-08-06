const express = require("express")
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
const customerRoutes = require("../routes/master/CustomerRoutes");
const NotificationRouter = require("../routes/notification/NotificationRoutes");
const categoryRoutes = require("../routes/master/CategoryRoutes"); 
const StateRoutes = require("../routes/master/StateRoutes"); 
const CityRoutes = require("../routes/master/CityRoutes"); 
const DesignationRoutes = require("../routes/master/DesignationRoutes"); 
const InwardRoutes = require("../routes/master/InwardRoutes"); 
const QualificationRoutes = require("../routes/master/QualificationRoutes"); 
const UnitRoutes = require("../routes/master/UnitRoutes"); 
const CompanyRoutes = require("../routes/master/CompanyRoutes")
const DepartmentMasterRoutes = require("../routes/master/DepartmentMasterRoutes")
const MakeMasterRoutes = require("../routes/master/MakeMasterRoutes")
const AccountRoutes = require("../routes/master/AccountRoutes")
const PackingMaterialRoutes = require("../routes/master/PackingMaterialRoutes")
const TransportRoutes = require("../routes/master/TransportRoutes")
const BatchMasterRoutes = require("../routes/master/BatchMasterRoutes")
const PendingOrderRoutes = require("../routes/master/PendingOrderRoutes")
const StockMasterRoutes = require("../routes/master/StockMasterRoutes")
const SalesMasterRoutes = require("../routes/master/SalesMasterRoutes")

router.use("/api", authRoutes);
router.use("/api", userRoutes);
router.use("/api", guardRoutes);
router.use("/api", grnRoutes);
router.use("/api", qaQcRoutes);
router.use("/api", dispatchRoutes);
router.use("/api", productionRoutes);
router.use("/api", supplierRoutes);
router.use("/api", categoryRoutes);
router.use("/api", UnitRoutes);
router.use("/api", RmCodeRoutes);
router.use("/api", customerRoutes);
router.use("/api", permissionRoutes);
router.use("/api", NotificationRouter)
router.use("/api", StaffMasterRoutes)
router.use("/api", DesignationRoutes)
router.use("/api", InwardRoutes)
router.use("/api", QualificationRoutes)
router.use("/api", StateRoutes)
router.use("/api", CityRoutes)
router.use("/api", CompanyRoutes)
router.use("/api", MakeMasterRoutes)
router.use("/api", DepartmentMasterRoutes)
router.use("/api", AccountRoutes)
router.use("/api", PackingMaterialRoutes)
router.use("/api", TransportRoutes)
router.use("/api", BatchMasterRoutes)
router.use("/api", PendingOrderRoutes)
router.use("/api", StockMasterRoutes)
router.use("/api", SalesMasterRoutes)

module.exports = router