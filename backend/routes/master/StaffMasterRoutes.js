// routes/StaffMasterRoutes.js
const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const StaffMasterController = require("../../controllers/master/StaffMaster/StaffMasterController");
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

router.post("/store-staff-master", upload.single('profile_photo'),StaffMasterController.createStaffMaster);
router.get("/get-staff-master", StaffMasterController.getAllStaffMaster);
router.get("/view-staff-master/:id", StaffMasterController.getStaffMasterById);
router.put("/update-staff-master/:id",upload.single('profile_photo'), StaffMasterController.updateStaffMaster);
router.delete("/delete-staff-master/:id", StaffMasterController.deleteStaffMaster);


module.exports = router;