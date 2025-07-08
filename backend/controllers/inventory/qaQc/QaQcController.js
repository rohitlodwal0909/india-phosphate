const { createNotificationByRoleId } = require("../../../helper/SendNotification");
const db = require("../../../models");

const { RawMaterial, RawMaterialQcResult, GrnEntry , Qcbatch,Notification } = db;
// Update Guard Entry

exports.approveOrRejectGrnEntry = async (req, res) => {
  const { id } = req.params;
  const {
    status, 
    remark 
  } = req.body;

  try {
    const entry = await GrnEntry.findByPk(id);

    if (!entry) {
      return res.status(404).json({ message: "Grn Entry not found" });
    }

    await entry.update({
      qa_qc_status: status,
      remarks: remark
    });

    let message = "";
        // Set notification title/message based on status
    let notificationTitle = "";
    let notificationMessage = "";
   

    if (status === "APPROVED") {
       notificationTitle = "Store Entry Approved";
      notificationMessage = `Store Entry  has been approved.`;
      message = "Store Entry approved successfully.";
    } else if (status === "REJECTED") {
       notificationTitle = "Store Entry Rejected";
      notificationMessage = `Store Entry  has been rejected. Reason: ${remark || "No reason provided."}`;
      message = "Store Entry rejected successfully.";
    } else if (status === "HOLD") {
        notificationTitle = "Store Entry On Hold";
      notificationMessage = `Store Entry  has been put on hold.`;
      message = "Store Entry put on hold successfully.";
    } else {
      notificationTitle = "Store Entry Updated";
      notificationMessage = `Store Entry  has been updated.`;
      message = "Store Entry updated.";
    }

 
 await createNotificationByRoleId({
    title: notificationTitle,
    message: notificationMessage,
    role_id: 2
  });
   
    res.status(200).json({
      message,
      data: entry
    });
  } catch (error) {
    console.error("Error updating Guard Entry:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.getRawmaterial = async (req, res) => {
  const { id } = req.params;
  try {
    const rawMaterial = await RawMaterial.findAll({
      where: {
        rm_code: id
      }
    });
    res.status(200).json(rawMaterial);
  } catch (error) {
    console.error("Error updating rawMaterial:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.getAllRawMaterials = async (req, res) => {
  try {
    const rawMaterials = await RawMaterial.findAll({
      // order: [['created_at', 'DESC']] // Optional: latest first
    });
    res.status(200).json({
      message: "All raw materials fetched successfully.",
      data: rawMaterials
    });
  } catch (error) {
    console.error("Error fetching raw materials:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.saveReportresult = async (req, res) => {
  const { data, qc_id, tested_by, rm_code } = req.body;

  try {
    const now = new Date();
    const date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    // const tested_by = tested_by;

    const entry = await GrnEntry.findByPk(qc_id);
    if (!entry) {
      return res.status(404).json({ message: "Grn Entry not found" });
    }
    for (const item of data) {
      let rawMaterialId = item.raw_material_id;

      // Check if raw_material_id is blank → then insert new RawMaterial
      if (rawMaterialId == "") {
        const newRawMaterial = await RawMaterial.create({
          rm_code: rm_code,
          test: item.test,
          limit: item.limit,
          type: item.type,
          result: item.result
        });
        rawMaterialId = newRawMaterial.id; // assign newly created ID back
      }

      // Insert QC result
      await RawMaterialQcResult.create({
        rm_id: rawMaterialId,
        qc_id: qc_id,
        test_date: date,
        result_value: item.result,
        tested_by: tested_by,
        type: item.type
      });
    }

    res.status(200).json({
      message: "QC Result saved successfully",
      data: entry
    });
  } catch (error) {
    console.error("Error saving QC Result:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.report = async (req, res) => {
  const { qc_id } = req.params;

  try {
    const grnEntry = await GrnEntry.findByPk(qc_id);

    if (!grnEntry) {
      return res.status(404).json({ message: "GRN Entry not found" });
    }

    const rm_code = grnEntry.store_rm_code;
    console.log("GRN → rm_code:", rm_code);

    let rawMaterialData = null;

    if (rm_code) {
      rawMaterialData = await RawMaterial.findAll({
        where: { rm_code },
        include: [
          {
            model: RawMaterialQcResult,
            as: "qc_results"
          }
        ],
        logging: console.log
      });

      if (!rawMaterialData) {
        console.warn(`No raw_material found for rm_code = '${rm_code}'`);
      }
    }

    res.status(200).json({
      message: "QC Result fetched successfully",
      grn_entry: grnEntry,
      raw_material: rawMaterialData
    });
  } catch (error) {
    console.error("Error fetching QC Result:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.addQcBatch = async (req, res) => {
  const { qc_batch_number } = req.body;

  if (!qc_batch_number) {
    return res.status(400).json({ message: "qc_batch_number is required." });
  }

  try {
    // Check uniqueness
    const exists = await Qcbatch.findOne({
      where: { qc_batch_number }
    });

    if (exists) {
      return res.status(409).json({ message: "qc_batch_number already exists." });
    }

    const newBatch = await Qcbatch.create({ qc_batch_number });
  await createNotificationByRoleId({
    title: "New Batch Number",
    message: "A new batch number has been successfully created.",
    role_id: 5
  });
  await createNotificationByRoleId({
  title: "New Batch Production",
  message: "A new batch number has been successfully entered. Please proceed with production.",
  role_id: 6
});
    res.status(201).json({
      message: "QC Batch created successfully.",
      data: newBatch
    });
  } catch (error) {
    console.error("Error creating QC batch:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


exports.getAllQcBatches = async (req, res) => {
  try {
    const batches = await Qcbatch.findAll({
      attributes: ['id', 'qc_batch_number'],
      // order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      message: 'QC Batches fetched successfully.',
      data: batches
    });
  } catch (error) {
    console.error("Error fetching QC batches:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
exports.deleteQcBatch = async (req, res) => {
  const { id } = req.params;

  try {
    const batch = await Qcbatch.findByPk(id);

    if (!batch) {
      return res.status(404).json({ message: "QC batch not found." });
    }

    await batch.destroy(); // soft-delete because model has paranoid: true

    res.status(200).json({ message: "QC batch deleted successfully." });
  } catch (error) {
    console.error("Error deleting QC batch:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};