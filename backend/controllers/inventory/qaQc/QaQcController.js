const db = require("../../../models");
const { RawMaterial, RawMaterialQcResult, GrnEntry } = db;
// Update Guard Entry

exports.approveOrRejectGrnEntry = async (req, res) => {
  const { id } = req.params;
  const {
    status, // 'APPROVED' or 'REJECTED'
    remark // Only for rejected
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

    if (status === "APPROVED") {
      message = "GRN Entry approved successfully.";
    } else if (status === "REJECTED") {
      message = "GRN Entry rejected successfully.";
    } else if (status === "HOLD") {
      message = "GRN Entry put on hold successfully.";
    } else {
      message = "GRN Entry updated.";
    }

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
