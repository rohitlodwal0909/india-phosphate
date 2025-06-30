const db = require("../../models");
const { RoleModel, RolePermissionModel } = db;

exports.roles = async (req, res) => {
  try {
    const roles = await RoleModel.findAll();

    res.json({ roles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
exports.savePermission = async (req, res) => {
  try {
    const { role_id, submodule_id, permission_id, status } = req.body;

    if (!role_id || !submodule_id || !permission_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const getPermission = await RolePermissionModel.findOne({
      where: { role_id, submodule_id, permission_id }
    });

    let action = "";
    if (getPermission) {
      // Update status
      await RolePermissionModel.update(
        { status },
        { where: { id: getPermission.id } }
      );
      action = "updated";
    } else {
      // Insert new
      await RolePermissionModel.create({
        role_id,
        submodule_id,
        permission_id,
        status
      });
      action = "created";
    }

    const permission = await RolePermissionModel.findOne({
      where: { id: permission_id }
    });

    const submoduleName =
      submodule_id == 1
        ? "Inbound Gate Entry"
        : submodule_id == 2
        ? "Store Verification"
        : "QA/QC Inspection";

    const permissionName = permission?.name || "Unknown Permission";
    const readableStatus = status ? "enabled" : "disabled";

    return res.status(200).json({
      message: ` Permission '${permissionName}' for '${submoduleName}' has been ${action} and ${readableStatus}.`,
      submodule: submoduleName,
      permission: permissionName,
      status: readableStatus,
      action
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.getrolepermission = async (req, res) => {
  try {
    const { role_id } = req.params;

    if (!role_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const getPermission = await RolePermissionModel.findAll({
      where: { role_id }
    });

    return res.status(200).json({
      permission: getPermission
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};
