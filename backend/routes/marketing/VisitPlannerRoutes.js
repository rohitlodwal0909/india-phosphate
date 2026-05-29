const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const VisitPlannerController = require("../../controllers/marketing/VisitPlanner/VisitPlannerController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/visit-planner");
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));
  }
});

/* =========================================================
    FILE FILTER
========================================================= */

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["application/pdf"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

/* =========================================================
    MULTER
========================================================= */

const upload = multer({
  storage,
  fileFilter
});

/* =========================================================
    ROUTES
========================================================= */

// Get All QA Documents
router.get("/get-visitplanners", VisitPlannerController.getVisitPlanner);

// Create QA Document
router.post(
  "/store-visitplanner",
  upload.array("files"),
  VisitPlannerController.storeVisitPlanner
);

// Update QA Document
router.put(
  "/update-visitplanner/:id",
  upload.array("files"),
  VisitPlannerController.updateVisitPlanner
);

// Delete QA Document
router.delete(
  "/delete-visitplanner/:id",
  VisitPlannerController.deleteVisitPlanner
);

module.exports = router;
