const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { PackingMaterial ,User} = db;
// Create Packing Material
exports.createPackingMaterial = async (req, res, next) => {
  try {
    const {
      material_name,
      material_code,
      material_type,
      supplier_id,
      unit_of_measurement,
      purchase_rate,
      current_stock,
      stock_quantity,
      min_required_stock,
      hsn_code,
      created_by
    } = req.body;
      // Check if material_code already exists
    const existingMaterialCode = await PackingMaterial.findOne({
      where: { material_code }
    });
    if (existingMaterialCode) {
      const error = new Error("Material code already exists");
      error.status = 400;
      return next(error);
    }

    // Check if hsn_code already exists
    const existingHSNCode = await PackingMaterial.findOne({
      where: { hsn_code }
    });
    if (existingHSNCode) {
      const error = new Error("HSN code already exists");
      error.status = 400;
      return next(error);
    }
     const user_id = created_by || req.body.created_by
      const user = await User.findByPk(user_id);
     const username = user ? user.username : "Unknown User";
    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Packing with material name '${material_name}' was created by '${username}' on ${entry_date} at ${entry_time}.`;
        await createLogEntry({ user_id: user_id, message: logMessage });
    const newPackingMaterial = await PackingMaterial.create({
      material_name,
      material_code,
      material_type,
      supplier_id,
      unit_of_measurement,
      purchase_rate,
      current_stock,
      stock_quantity,
      min_required_stock,
      hsn_code,
      created_by,
      created_at: new Date()
    });

    res.status(201).json(newPackingMaterial);
  } catch (error) {
    next(error);
  }
};

exports.getPackingMaterialById = async (req, res,next) => {
  try {
    const PackingMaterials = await PackingMaterial.findByPk(req.params.id);
    if (!PackingMaterials){
      const error = new Error( "PackingMaterial entry not found");
       error.status = 404;
      return next(error); 
    }
    res.json(PackingMaterials);
  } catch (error) {
   next(error)
  }
};

// Read By ID
exports.getAllPackingMaterial = async (req, res,next ) => {
  try {
     const material = await PackingMaterial.findAll({
      where: {
        deleted_at: null // optional: exclude soft-deleted records
      },
      order: [['created_at', 'DESC']]
    });
     const resultWithUsernames = await Promise.all(
      material.map(async (make) => {
        const user = await User.findOne({
          where: { id: make.created_by },
          attributes: ['username']
        });

        return {
          ...make.toJSON(),
          created_by_username: user?.username || null
        };
      })
    );

    res.status(200).json(resultWithUsernames);
  } catch (error) {
   next(error)
  }
};


// Update
exports.updatePackingMaterial = async (req, res, next) => {
  try {
    const packingMaterial = await PackingMaterial.findByPk(req.params.id);

    if (!packingMaterial) {
      const error = new Error("PackingMaterial entry not found");
      error.status = 404;
      return next(error);
    }

    const {
      material_name,
      material_code,
      material_type,
      supplier_id,
      unit_of_measurement,
     purchase_rate,
      current_stock,
      stock_quantity,
      min_required_stock,
      hsn_code,
      created_by
    } = req.body;
     const user_id = created_by || req.body.created_by
      const user = await User.findByPk(user_id);
     const username = user ? user.username : "Unknown User";
    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Packing with material name '${material_name}' was updated by '${username}' on ${entry_date} at ${entry_time}.`;
        await createLogEntry({ user_id: user_id, message: logMessage });
    await packingMaterial.update({
      material_name,
      material_code,
      material_type,
      supplier_id,
      unit_of_measurement,
     purchase_rate,
      current_stock,
      stock_quantity,
      min_required_stock,
      hsn_code,
      created_by,
      updated_at: new Date()
    });

    res.json(packingMaterial);
  } catch (error) {
    next(error);
  }
};



// Delete
exports.deletePackingMaterial = async (req, res,next) => {
  try {
    const PackingMaterials = await PackingMaterial.findByPk(req.params.id);
    if (!PackingMaterials)
     {
       const error = new Error( "PackingMaterial entry not found");
       error.status = 404;
      return next(error); 
     }
          const user_id = PackingMaterials?.created_by || req.body.created_by
      const user = await User.findByPk(user_id);
     const username = user ? user.username : "Unknown User";
    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Packing with material name '${PackingMaterials?.material_name}' was deleted by '${username}' on ${entry_date} at ${entry_time}.`;
        await createLogEntry({ user_id: user_id, message: logMessage });
    await PackingMaterials.destroy();
    res.json({ message: "PackingMaterial entry deleted" });
  } catch (error) {
   next(error)
  }
};