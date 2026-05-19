const { where } = require("sequelize");
const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const db = require("../../../models");
const path = require("path");

const { pdfCompressor } = require("../../../helper/pdfCompressor");
const {
  SampleRequestModel,
  SampleProductsModel,
  Customer,
  WorkOrderModel,
  Product,
  User
} = db;

exports.getSampleRequest = async (req, res) => {
  try {
    const data = await SampleRequestModel.findAll({
      order: [["id", "DESC"]],
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "username"]
        },
        {
          model: Customer,
          as: "customers"
        },
        {
          model: SampleProductsModel,
          as: "interested_products",
          required: false,
          include: [
            {
              model: Product,
              as: "product",
              required: false
            }
          ]
        }
      ]
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.storeSampleRequest = async (req, res) => {
  try {
    /* ------------------ Parse Items ------------------ */

    let items =
      typeof req.body.items === "string"
        ? JSON.parse(req.body.items)
        : req.body.items;

    /* FILE MAP */
    const fileMap = {};

    for (const file of req.files || []) {
      let finalFile = file.filename;

      const fullPath = path.join(file.destination, file.filename);

      // ✅ Auto Compress PDF
      if (file.mimetype === "application/pdf") {
        const compressedPath = await pdfCompressor(fullPath);

        finalFile = path.basename(compressedPath);
      }

      fileMap[file.fieldname] = finalFile;
    }

    /* ATTACH FILE TO ITEMS */
    items = items.map((item, index) => ({
      ...item,
      file: fileMap[`file_${index}`] || null
    }));

    /* ------------------ Generate SR No ------------------ */
    const year = new Date().getFullYear();

    const lastSR = await SampleRequestModel.findOne({
      order: [["id", "DESC"]]
    });

    let sr_no = `S-${year}-001`;

    if (lastSR && lastSR.sr_no) {
      const lastNumber = parseInt(lastSR.sr_no.split("-")[2]);
      const newNumber = lastNumber + 1;

      sr_no = `S-${year}-${String(newNumber).padStart(3, "0")}`;
    }

    /* ------------------ Create Sample Request ------------------ */
    const sampleRequest = await SampleRequestModel.create({
      ...req.body,
      user_id: req.admin.id,
      sr_no
    });

    /* ------------------ Prepare Products ------------------ */
    const productData = items.map((item) => ({
      sample_id: sampleRequest.id,
      product_id: item.product_id,
      grade: item.grade,
      qty: item.qty,
      sample_type: item.sample_type,
      file: item.file || null
    }));

    /* ------------------ Bulk Insert Products ------------------ */
    if (productData.length > 0) {
      await SampleProductsModel.bulkCreate(productData);
    }

    const title = "Sample Submitted to QC";

    const message = `Marketing has submitted Sample ${sr_no}.
       Kindly perform testing, upload COA and update QC status.`;

    await createNotificationByRoleId({
      title,
      message,
      role_id: 3,
      module_id: 4,
      submodule_id: 7
    });

    /* ------------------ Response ------------------ */
    res.json({
      message: "Sample Request Created Successfully",
      data: sampleRequest
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};

exports.updateSampleRequest = async (req, res) => {
  try {
    const id = req.params.id;

    /* ------------------ FIND EXISTING ------------------ */

    const sampleRequest = await SampleRequestModel.findByPk(id);

    if (!sampleRequest) {
      return res.status(404).json({
        message: "Sample Request not found"
      });
    }

    /* ------------------ PARSE ITEMS ------------------ */

    let items =
      typeof req.body.items === "string"
        ? JSON.parse(req.body.items)
        : req.body.items;

    /* ------------------ FILE MAP ------------------ */

    const fileMap = {};

    (req.files || []).forEach((file) => {
      fileMap[file.fieldname] = file.filename;
    });

    /* ------------------ ATTACH FILES ------------------ */

    items = items.map((item, index) => ({
      ...item,
      file:
        fileMap[`file_${index}`] || // new uploaded file
        item.existing_file || // keep old file
        null
    }));

    /* ------------------ UPDATE MAIN REQUEST ------------------ */

    await sampleRequest.update({
      ...req.body,
      docket_remark: req.body.docket_remark,
      sample_status: req.body.sample_status
    });

    /* ------------------ DELETE OLD PRODUCTS ------------------ */

    await SampleProductsModel.destroy({
      where: { sample_id: id }
    });

    /* ------------------ INSERT UPDATED PRODUCTS ------------------ */

    const productData = items.map((item) => ({
      sample_id: id,
      product_id: item.product_id,
      grade: item.grade,
      qty: item.qty,
      sample_type: item.sample_type,
      file: item.file
    }));

    if (productData.length > 0) {
      await SampleProductsModel.bulkCreate(productData);
    }

    /* ------------------ NOTIFICATION ------------------ */

    const title = "Sample Request Updated";

    const message = `Sample ${sampleRequest.sr_no} has been updated by Marketing.`;

    await createNotificationByRoleId({
      title,
      message,
      role_id: 3,
      module_id: 4,
      submodule_id: 7
    });

    /* ------------------ RESPONSE ------------------ */

    res.json({
      message: "Sample Request Updated Successfully",
      data: sampleRequest
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};

exports.deletePurchaseOrder = async (req, res) => {
  try {
    await PurchaseOrderModel.destroy({
      where: { id: req.params.id }
    });

    res.json({ message: "Purchase Order Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadQcCoa = async (req, res) => {
  try {
    const { sample_id, sample_given, qc_remark } = req.body;

    /* ------------------ FILE UPLOAD ------------------ */

    let coa_pdf = null;

    if (req.file) {
      coa_pdf = req.file.filename; // multer upload
    }

    /* ------------------ UPDATE SAMPLE ------------------ */

    const sampleRequest = await SampleRequestModel.update(
      {
        qc_status: sample_given,
        qc_remark,
        qc_coa_pdf: coa_pdf
      },
      {
        where: { id: sample_id }
      }
    );

    /* ------------------ NOTIFICATION ------------------ */

    const title = "COA Uploaded by QC";

    const message = `QC has uploaded the COA for Sample ID ${sample_id}.
Marketing team can now proceed with dispatch details.`;

    await createNotificationByRoleId({
      title,
      message,
      role_id: 9, // Marketing Role
      module_id: 4,
      submodule_id: 3
    });

    /* ------------------ RESPONSE ------------------ */

    res.json({
      message: "COA Uploaded Successfully",
      data: sampleRequest
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};
