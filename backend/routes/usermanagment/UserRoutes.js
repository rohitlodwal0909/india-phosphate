const express = require("express");
const router = express.Router();
const UserController = require("../../controllers/usermanagment/UserController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/signatures/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
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
