const express = require("express");
const router = express.Router();
const UserController = require("../../controllers/usermanagment/UserController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const uploadDir = path.join(__dirname, "../../uploads/signatures");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, "signature-" + Date.now() + ext);
  }
});

const upload = multer({ storage });

router.post("/register", upload.single("signature"), UserController.register);

router.get("/user/all", UserController.listAllUsers);

router.delete("/user/delete/:id", UserController.delete);

router.put(
  "/update-password",
  upload.single("signature"),
  UserController.updatePassword
);

module.exports = router;
