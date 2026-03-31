const express = require("express");
const router = express.Router();
const UserController = require("../../controllers/usermanagment/UserController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/signatures/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

router.post("/register", upload.single("signature"), UserController.register);

router.get("/user/all", UserController.listAllUsers);

router.delete("/user/delete/:id", UserController.delete);

router.put(
  "/update-password",
  upload.single("signature"),
  UserController.updatePassword
);

module.exports = router;
