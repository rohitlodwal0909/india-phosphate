// routes/DepartmentMasterRoutes.js
const express = require("express");
const router = express.Router();
const DepartmentMasterController = require("../../controllers/master/DepartmentMaster/DepartmentMasterController");


router.post("/store-department-master", DepartmentMasterController.createDepartmentMaster);
router.get("/get-department-master", DepartmentMasterController.getAllDepartmentMaster);
router.get("/view-department-master/:id", DepartmentMasterController.getDepartmentMasterById);
router.put("/update-department-master/:id", DepartmentMasterController.updateDepartmentMaster);
router.delete("/delete-department-master/:id", DepartmentMasterController.deleteDepartmentMaster);


module.exports = router;