const express = require("express");
const router = express.Router();
const PermissionController = require("../../controllers/authentication/PermissionController");

router.get("/api/roles", PermissionController.roles);
router.post("/api/save/permission", PermissionController.savePermission);
router.get( "/api/role/permission/:role_id", PermissionController.getrolepermission
);
module.exports = router;
