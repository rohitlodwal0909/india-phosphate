const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const DocumentController = require("../../controllers/master/Document/DocumentController");

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

router.post("/store-document", upload.single('document_file'), DocumentController.createDocument);
router.get("/get-document", DocumentController.getAllDocument);
router.get("/view-document/:id", DocumentController.getDocumentById);
router.put("/update-document/:id",upload.single('document_file'), DocumentController.updateDocument);
router.put("/status-document/:id", DocumentController.updateDocumentStatus);
router.delete("/delete-document/:id", DocumentController.deleteDocument);

module.exports = router;
