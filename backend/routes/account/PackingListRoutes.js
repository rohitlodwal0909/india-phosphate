const express = require("express");
const router = express.Router();
const PackingListController = require("../../controllers/account/invoice/ExportPackingListController");
const multer = require("multer");
const path = require("path");
const {
  protectedExcelDownload
} = require("../../middleware/excelDownloadMiddleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/packing-list/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

router.post(
  "/upload-packing-list",
  upload.single("excel"),
  PackingListController.exportPackingListUpload
);

router.put(
  "/update-export-packing-list/:id",
  upload.single("excel"),
  PackingListController.exportPackingListUpdate
);

router.get(
  "/get-export-packing-list",
  PackingListController.getExcelPackingList
);

router.delete(
  "/delete-export-packing-list/:id",
  PackingListController.deleteExportPackingList
);

router.get(
  "/download-packing-list/:id",
  PackingListController.download,
  protectedExcelDownload
);

module.exports = router;
