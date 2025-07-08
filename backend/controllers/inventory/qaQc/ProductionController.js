const {  createNotificationByRoleId } = require("../../../helper/SendNotification");
const db = require("../../../models");
const { Op } = require("sequelize");
const {  ProductionResult ,GrnEntry,Finishing,RoleModel} = db;

exports.ProductionaddResult = async (req, res) => {
  try {
    const { rm_code = [], quantity = [], ...rest } = req.body;
    for (let i = 0; i < rm_code.length; i++) {
      const code   = rm_code[i];
      const reqQty = quantity[i] ?? 0;
      const grnEntry = await GrnEntry.findOne({ where: { store_rm_code: code } });

      if (!grnEntry) {
        return res.status(400).json({
          message: `${code} is not available in the store.`,
        });
      }
      // 처음엔 pending_quantity가 null/0일 수 있으므로 container_count 사용
      const availableQty = 
        grnEntry.pending_quantity !== null 
          ? grnEntry.pending_quantity 
          : grnEntry.container_count;

      if (availableQty < reqQty) {
        return res.status(400).json({
       
          message: `Store has only ${availableQty} quantity for ${code},but ${reqQty} units were requested.`,
        });
      }
    }

    // 2) ProductionResult 생성
    const newEntry = await ProductionResult.create(req.body);

    // 3) 각 GRN entry 업데이트
    for (let i = 0; i < rm_code.length; i++) {
      const code   = rm_code[i];
      const reqQty = quantity[i] ?? 0;
      const grnEntry = await GrnEntry.findOne({ where: { store_rm_code: code } });

      if (grnEntry) {
       
        const availableQty = 
          grnEntry.pending_quantity !== null 
            ? grnEntry.pending_quantity 
            : grnEntry.container_count;

        await grnEntry.update({
          production_status: "ISSUE",
          // pending_quantity에서 차감
          pending_quantity: availableQty - reqQty,
        });
      }
    }
   const productionRole = await RoleModel.findOne({ where: { name: { [Op.like]: "%Production%" } } });
    const storeRole = await RoleModel.findOne({ where: { name: { [Op.like]: "%Inventory Manager%" } } });

   if(productionRole) {

     await createNotificationByRoleId({
       title: "New Production",
       message: `Production has been successfully created.`,
       role_id:productionRole?.id, // production creator
     });
    }
if(storeRole){

  await createNotificationByRoleId({
    title: "Store Request",
    message: `Store request has been successfully submitted by production.`,
    role_id: storeRole?.id  
  });
}
 await createNotificationByRoleId({
  title: "Finishing Request",
  message: "A  request has been submitted by the production team with RM code details.",
  role_id: 7
});

    return res.status(201).json({
      message: "Production Entry created successfully",
      data: newEntry,
    });
  } catch (error) {
    console.error("Error in ProductionaddResult:", error);
    return res.status(500).json({ message: "Server Error", error });
  }
};

exports.getAllProductionResults = async (req, res) => {
  try {
    const results = await ProductionResult.findAll({
      include: [
        {
          model: Finishing,
          as: 'finishing_entries', // match alias from association
          required: false // true if you want only those with finishing data
        }
      ],
     order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      message: "Production results fetched successfully.",
      data: results
    });
  } catch (error) {
    console.error("Error fetching production results:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};



exports.createFinishingEntry = async (req, res) => {
  try {
    const {
      finishing,
      unfinishing,
      finish_quantity,
      unfinish_quantity,
      batch_number
    } = req.body;

    if (
      !finishing ||
      !unfinishing ||
      !finish_quantity ||
      !unfinish_quantity ||
      !batch_number
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newEntry = await Finishing.create({
      finishing,
      unfinishing,
      finish_quantity,
      unfinish_quantity,
      batch_number
    });

  await createNotificationByRoleId({
  title: "Dispatch Request",
  message: "Finishing team has completed . Batch number is now ready for dispatch.",
  role_id: 8
});

    return res.status(201).json({
      message: "Finishing entry created successfully.",
      data: newEntry
    });
  } catch (error) {
    console.error("Error creating finishing entry:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
}

exports.updateFinishingEntry = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await Finishing.findOne({
      where: { batch_number :id }
    });

    if (!existing) {
      return res.status(404).json({ message: "Finishing entry not found." });
    }

    await existing.update(req.body);

    res.status(200).json({
      message: "Finishing entry updated successfully.",
      data: existing
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};



