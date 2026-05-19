const express = require("express");
const router = express.Router();
const QaDocumentController = require("../../controllers/marketing/QaDocument/QaDocumentController");

// Get All Purchase Orders
router.get("/get-qa-documents", QaDocumentController.getQaDocument);

// Store Purchase Order
router.post("/create-qa-documents", QaDocumentController.storeQaDocument);

// Update Purchase Order
router.put("/update-qa-documents/:id", QaDocumentController.updateQaDocument);

// Delete Purchase Order
router.delete(
  "/delete-qa-documents/:id",
  QaDocumentController.deleteQaDocument
);

module.exports = router;
