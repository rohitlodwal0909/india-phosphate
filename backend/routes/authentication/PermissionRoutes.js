const express = require("express");
const router = express.Router();
const PermissionController = require("../../controllers/authentication/PermissionController");

router.get("/roles", PermissionController.roles);
router.post("/save/permission", PermissionController.savePermission);
router.get("/role/permission/:userId", PermissionController.getrolepermission);
module.exports = router;
