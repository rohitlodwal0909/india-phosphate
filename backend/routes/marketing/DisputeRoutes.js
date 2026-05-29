const express = require("express");
const router = express.Router();
const DisputeController = require("../../controllers/marketing/Dispute/DisputeController");

const multer = require("multer");
const path = require("path");

/* ================= MULTER ================= */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/dispute");
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,

  fileFilter: function (req, file, cb) {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }

    cb(null, true);
  }
});

router.get("/get-poandsample/:name", DisputeController.getpoandsample);

// Get All Purchase Orders
router.get("/get-disputes", DisputeController.getDisputes);

// Store Purchase Order
router.post(
  "/store-dispute",
  upload.single("pdf"),
  DisputeController.storeDispute
);

// Update Purchase Order
router.put(
  "/update-dispute/:id",
  upload.single("pdf"),
  DisputeController.updateDispute
);

// Delete Purchase Order
router.delete("/delete-dispute/:id", DisputeController.deleteAudit);

module.exports = router;
