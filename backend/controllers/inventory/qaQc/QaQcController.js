const { createLogEntry } = require("../../../helper/createLogEntry");
const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const db = require("../../../models");

const {
  RawMaterial,
  RawMaterialQcResult,
  GrnEntry,
  Qcbatch,
  Notification,
  Finishing,
  User
} = db;
// Update Guard Entry

exports.approveOrRejectGrnEntry = async (req, res, next) => {
  const { id } = req.params;
  const { status, remark, user_id } = req.body;

  try {
    const entry = await GrnEntry.findByPk(id);

    if (!entry) {
      const error = new Error("Grn Entry not found");
      error.status = 404;
      return next(error);
    }
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";

    await entry.update({
      qa_qc_status: status,
      remarks: remark
    });

    let message = "";

    let notificationTitle = "";
    let notificationMessage = "";
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `QA/QC status was set to "${status}" by ${username} on ${entry_date} at ${entry_time}.`;
    await createLogEntry({
      user_id,
      message: logMessage
    });

    if (status === "APPROVED") {
      notificationTitle = "Store Entry Approved";
      notificationMessage = `Store Entry  has been approved.`;
      message = "Store Entry approved successfully.";
    } else if (status === "REJECTED") {
      notificationTitle = "Store Entry Rejected";
      notificationMessage = `Store Entry  has been rejected. Reason: ${
        remark || "No reason provided."
      }`;
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
    next(error);
  }
};

exports.getRawmaterial = async (req, res, next) => {
  const { id } = req.params;
  try {
    const rawMaterial = await RawMaterial.findAll({
      where: {
        rm_code: id
      }
    });
    res.status(200).json(rawMaterial);
  } catch (error) {
    next(error);
  }
};

exports.getAllRawMaterials = async (req, res, next) => {
  try {
    const rawMaterials = await RawMaterial.findAll({
      // order: [['created_at', 'DESC']] // Optional: latest first
    });
    res.status(200).json({
      message: "All raw materials fetched successfully.",
      data: rawMaterials
    });
  } catch (error) {
    next(error);
  }
};

exports.saveReportresult = async (req, res, next) => {
  const { data, qc_id, tested_by, rm_code, qcRef } = req.body;

  try {
    const now = new Date();
    const date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    // const tested_by = tested_by;

    const entry = await GrnEntry.findByPk(qc_id);

    if (!entry) {
      const error = new Error("Grn Entry not found");
      error.status = 404;
      return next(error);
    }

    await entry.update({ qc_ref: qcRef });

    for (const item of data) {
      let rawMaterialId = item.raw_material_id;

      // Check if raw_material_id is blank → then insert new RawMaterial
      if (rawMaterialId == "") {
        const newRawMaterial = await RawMaterial.create({
          rm_code: rm_code,
          test: item.test,
          limit: item.limit,
          type: item.type
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
    next(error);
  }
};

exports.report = async (req, res, next) => {
  const { qc_id } = req.params;
  try {
    const grnEntry = await GrnEntry.findByPk(qc_id);

    if (!grnEntry) {
      const error = new Error("Grn Entry not found");
      error.status = 404;
      return next(error);
    }

    const rawmaterial = await RawMaterialQcResult.findOne({ where: { qc_id } });

    if (!rawmaterial) {
      console.log("No RawMaterialQcResult found for this qc_id");
      return;
    }

    // 2. Get rm_id from that result
    const rmId = rawmaterial.rm_id;

    // 3. First get the rm_code using rmId
    const rawMaterialEntry = await RawMaterial.findOne({
      where: { id: rmId }
    });

    if (!rawMaterialEntry) {
      console.log("No RawMaterial found for this rm_id");
      return;
    }
    const rmCode = rawMaterialEntry?.rm_code;

    let rawMaterialData = null;
    if (rmCode) {
      rawMaterialData = await RawMaterial.findAll({
        where: { rm_code: rmCode },
        include: [
          {
            model: RawMaterialQcResult,
            as: "qc_results",
            where: { qc_id }, // Only include QC results with matching qc_id
            required: true
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
    next(error);
  }
};

exports.addQcBatch = async (req, res, next) => {
  const {
    qc_batch_number,
    product_name,
    mfg_date,
    exp_date,
    grade,
    size,
    user_id
  } = req.body;

  if (!qc_batch_number) {
    const error = new Error("qc_batch_number is required.");
    error.status = 400;
    return next(error);
  }

  try {
    // Check uniqueness
    const exists = await Qcbatch.findOne({
      where: { qc_batch_number }
    });

    if (exists) {
      const error = new Error("qc_batch_number already exists.");
      error.status = 400;
      return next(error);
    }

    const newBatch = await Qcbatch.create({
      qc_batch_number,
      product_name,
      mfg_date,
      exp_date,
      grade,
      size,
      user_id
    });
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
    const logMessage = `QA Batch  entry for Batch Number  ${qc_batch_number} was created by ${username} on ${entry_date} at ${entry_time}.`;
    await createLogEntry({
      user_id,
      message: logMessage
    });
    await createNotificationByRoleId({
      title: "New Batch Number",
      message: "A new batch number has been successfully created.",
      role_id: 5
    });
    await createNotificationByRoleId({
      title: "New Batch Production",
      message:
        "A new batch number has been successfully entered. Please proceed with production.",
      role_id: 6
    });
    res.status(201).json({
      message: "QC Batch created successfully.",
      data: newBatch
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllQcBatches = async (req, res, next) => {
  try {
    const batches = await Qcbatch.findAll({
      order: [["created_at", "DESC"]],
      include: [
        {
          model: Finishing,
          as: "finishing"
        }
      ]
    });
    res.status(200).json({
      message: "QC Batches fetched successfully.",
      data: batches
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteQcBatch = async (req, res, next) => {
  const { id } = req.params;
  const { user_id } = req.body;
  try {
    const batch = await Qcbatch.findByPk(id);

    if (!batch) {
      const error = new Error("QC batch not found");
      error.status = 404;
      return next(error);
    }

    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
    const logMessage = `QA Batch entry for Batch Number  ${batch?.qc_batch_number} was deleted by ${username} on ${entry_date} at ${entry_time}.`;
    await createLogEntry({
      user_id,
      message: logMessage
    });
    await batch.destroy(); // soft-delete because model has paranoid: true
    res.status(200).json({ message: "QC batch deleted successfully." });
  } catch (error) {
    next(error);
  }
};

// QA / QC Approved

exports.batchStatusChange = async (req, res, next) => {
  const { id } = req.params;
  try {
    const batch = await Qcbatch.findByPk(id);

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // Toggle status (Approved ↔ Not Approved)
    batch.status = batch.status === "Approved" ? "Not Approved" : "Approved";
    await batch.save();

    res.status(200).json({
      message: "Batch status updated successfully",
      batch
    });
  } catch (error) {
    next(error);
  }
};

exports.addRefrenseNumber = async (req, res, next) => {
  const { batch_id, reference_number } = req.body;

  try {
    const id = batch_id;
    const batch = await Qcbatch.findByPk(id);

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // Save reference number (if provided)
    if (reference_number) {
      batch.reference_number = reference_number;
    }

    await batch.save();

    res.status(200).json({
      message: "Batch updated successfully",
      batch
    });
  } catch (error) {
    console.error("Error updating batch:", error);
    next(error);
  }
};
