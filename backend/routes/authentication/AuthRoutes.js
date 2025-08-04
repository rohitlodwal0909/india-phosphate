const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const AuthController = require("../../controllers/authentication/AuthController");

// Setup multer
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

router.post("/login", AuthController.login);
router.get("/get-profile/:id", AuthController.getProfileById);
router.put("/update-profile/:id", upload.single('profile_image'), AuthController.updateProfile);
router.put('/change-password/:id', AuthController.changePassword);
router.get('/get-log', AuthController.getAllLogs)
router.post("/forgot-password", AuthController.forgotPassword);
module.exports = router;
