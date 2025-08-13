const db = require("../../models");
const { RoleModel, RolePermissionModel,PermissionModel } = db;

exports.roles = async (req, res, next ) => {
  try {
    const roles = await RoleModel.findAll();

    res.json({ roles });
  } catch (error) {
   next(error)
  }
};

// exports.savePermission = async (req, res,next) => {
//   try {
//     const { role_id, submodule_id, permission_id, status } = req.body;

//     if (!role_id || !submodule_id || !permission_id) {
//        const error = new Error( "Missing required fields");
//            error.status = 400;
//         return next(error);
//     }

//     const getPermission = await RolePermissionModel.findOne({
//       where: { role_id, submodule_id, permission_id }
//     });

//     let action = "";
//     if (getPermission) {
//       // Update status
//       await RolePermissionModel.update(
//         { status },
//         { where: { id: getPermission.id } }
//       );
//       action = "updated";
//     } else {
//       // Insert new
//       await RolePermissionModel.create({
//         role_id,
//         submodule_id,
//         permission_id,
//         status
//       });
//       action = "created";
//     }

//     const permission = await RolePermissionModel.findOne({
//       where: { id: permission_id }
//     });

//     const submoduleName =
//       submodule_id == 1
//         ? "Inbound Gate Entry"
//         : submodule_id == 2
//         ? "Store Verification"
//         : "QA/QC Inspection";

//     const permissionName = permission?.name || "Unknown Permission";
//     const readableStatus = status ? "enabled" : "disabled";

//     return res.status(200).json({
//       message: ` Permission '${permissionName}' for '${submoduleName}' has been ${action} and ${readableStatus}.`,
//       submodule: submoduleName,
//       permission: permissionName,
//       status: readableStatus,
//       action
//     });
//   } catch (error) {
//    next(error)
//   }
// };


exports.savePermission = async (req, res, next) => {
  try {
    const { role_id, module_id, submodule_id, permission_id, status } = req.body;

    if (!role_id || !module_id || !submodule_id || !permission_id) {
      const error = new Error("Missing required fields");
      error.status = 400;
      return next(error);
    }


    const getPermission = await RolePermissionModel.findOne({
      where: { role_id, submodule_id, permission_id ,module_id}
    });

    let action = "";

    if (getPermission) {
      await RolePermissionModel.update(
        { status },
        { where: { id: getPermission.id } }
      );
      action = "updated";
    } else {
      await RolePermissionModel.create({
        role_id,
        submodule_id,
        permission_id,
        status,
        module_id
      });
      action = "created";
    }

    const permission = await PermissionModel.findOne({
      where: { id: permission_id }
    });
    
     const submoduleName = await RoleModel.findOne({
      where: { id: submodule_id }
    });
    
  
    const permissionName = permission?.name || "Unknown Permission";
    const submodlenames = submoduleName?.name || "master" || "Dashboard";
    const readableStatus = status ? "enabled" : "disabled";

    return res.status(200).json({
      message: `Permission '${permissionName}' for '${submodlenames}' has been ${action} and ${readableStatus}.`,
      submodule: submoduleName,
      permission: permissionName,
      status: readableStatus,
      action
    });
  } catch (error) {
    next(error);
  }
};

exports.getrolepermission = async (req, res,next ) => {
  try {
    const { role_id } = req.params;

    if (!role_id) {
       const error = new Error( "Missing required fields");
           error.status = 400;
        return next(error);

    }

    const getPermission = await RolePermissionModel.findAll({
      where: { role_id }
    });

    return res.status(200).json({
      permission: getPermission
    });
  } catch (error) {
    next(error)
  }
};
