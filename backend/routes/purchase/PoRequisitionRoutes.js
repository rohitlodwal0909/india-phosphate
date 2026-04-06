const express = require("express");
const router = express.Router();
const PoRequisitionController = require("../../controllers/purchase/requisition/PoRequisitionController");

/* ======================================================
   ROUTES
====================================================== */

router.get("/get-remaining-stock", PoRequisitionController.getRemaningStock);
router.post("/create-requisition", PoRequisitionController.createPoRequisition);
router.put(
  "/update-requisition/:id",
  PoRequisitionController.updatePoRequisition
);
router.get("/get-requisition", PoRequisitionController.getPoRequisition);

router.delete(
  "/delete-requisition/:id",
  PoRequisitionController.deletePoRequisition
);

module.exports = router;
