const express = require("express");
const router = express.Router();
const DraftPackingListController = require("../../controllers/account/invoice/DraftPackingListController");

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
    cb(null, "uploads/draft-packing-list/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

/* ======================================================
   ROUTES
====================================================== */

// ✅ CREATE
router.post(
  "/upload-draft-packing-list",
  upload.single("excel"),
  DraftPackingListController.createDraftPackingList
);

// ✅ UPDATE
router.put(
  "/update-draft-packing-list/:id",
  upload.single("excel"),
  DraftPackingListController.updateDraftPackingList
);

// ✅ GET ALL
router.get(
  "/get-draft-packing-list",
  DraftPackingListController.getDraftPackingList
);

// ✅ DELETE
router.delete(
  "/delete-draft-packing-list/:id",
  DraftPackingListController.deleteDraftPackingList
);

router.get(
  "/download-draft-packing-list/:id",
  DraftPackingListController.download,
  protectedExcelDownload
);

module.exports = router;
