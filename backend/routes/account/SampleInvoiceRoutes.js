const router = require("express").Router();
const SampleInvoiceController = require("../../controllers/account/invoice/SampleInvoiceController");

const multer = require("multer");
const path = require("path");
const {
  protectedExcelDownload
} = require("../../middleware/excelDownloadMiddleware");

/* ======================================================
   MULTER STORAGE
====================================================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/sampleInvoices/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

/* CREATE */
router.post(
  "/upload-sample-invoice",
  upload.single("excel"),
  SampleInvoiceController.uploadSampleInvoice
);

/* GET */
router.get("/get-sample-invoice", SampleInvoiceController.getSampleInvoice);

/* UPDATE */
router.put(
  "/update-sample-invoice/:id",
  upload.single("excel"),
  SampleInvoiceController.updateSampleInvoice
);

/* DELETE */
router.delete(
  "/delete-sample-invoice/:id",
  SampleInvoiceController.deleteSampleInvoice
);

router.get(
  "/download-sample-invoice/:id",
  SampleInvoiceController.downloadSampleInvoice,
  protectedExcelDownload
);

module.exports = router;
