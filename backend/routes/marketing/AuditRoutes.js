const express = require("express");
const router = express.Router();
const AuditController = require("../../controllers/marketing/Audit/AuditController");

const multer = require("multer");
const path = require("path");

/* ================= MULTER ================= */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/audit");
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

// Get All Purchase Orders
router.get("/get-audit", AuditController.getAudit);

// Store Purchase Order
router.post("/store-audit", upload.single("pdf"), AuditController.storeAudit);

// Update Purchase Order
router.put(
  "/update-audit/:id",
  upload.single("pdf"),
  AuditController.updateAudit
);

// Delete Purchase Order
router.delete("/delete-audit/:id", AuditController.deleteAudit);

module.exports = router;
