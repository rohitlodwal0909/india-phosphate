const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { Document } = db;
const moment = require('moment');
// Create
exports.createDocument = async (req, res, next) => {
  try {
    const today = moment().format("YYYY-MM-DD");

    // Count documents created today
    const countToday = await Document.count({
      where: {
        document_date: today
      }
    });

    // Generate Document Number like EXD-20250811-001
    const serial = String(countToday + 1).padStart(3, "0");
    const documentNumber = `EXD-${moment().format("YYYYMMDD")}-${serial}`;

    // Handle file upload path
    const documentFile = req.file;
    const documentFilePath = documentFile ? `/uploads/${documentFile.filename}` : null;

    // Create document
    const newDocument = await Document.create({
      document_number: documentNumber,
      document_date: today,
      export_type: req.body.export_type,
      customer_name: req.body.customer_name,
      export_status: req.body.export_status,
      document_file: documentFilePath,
      remarks: req.body.remarks,
      created_by: req.body.created_by // Only if your model has this field
    });

    res.status(201).json(newDocument);
  } catch (err) {
    next(err);
  }
};

exports.getDocumentById = async (req, res,next) => {
  try {
    const Documents = await Document.findByPk(req.params.id);
    if (!Documents){
       const error = new Error( "Document entry not found" );
       error.status = 404;
      return next(error)
    }
   
    res.json(Documents);
  } catch (error) {
   next(error)
  }
};

// Read By ID
exports.getAllDocument = async (req, res,next) => {
  try {
    const Documents = await Document.findAll({
     
      order: [['created_at', 'DESC']]
    });
    res.status(200).json(Documents);
  } catch (error) {
   next(error)
  }
};


exports.updateDocument = async (req, res, next) => {
  try {
    const id = req.params.id;

    // Find the document
    const document = await Document.findByPk(id);

    if (!document) {
      const error = new Error("Document entry not found");
      error.status = 404;
      return next(error);
    }

    // Handle uploaded file if available
    const documentFile = req.file;
    const documentFilePath = documentFile ? `/uploads/${documentFile.filename}` : document.document_file;

    // Update only allowed fields
    await document.update({
      export_type: req.body.export_type || document.export_type,
      customer_name: req.body.customer_name || document.customer_name,
      export_status: req.body.export_status || document.export_status,
      remarks: req.body.remarks || document.remarks,
      document_file: documentFilePath
    });

    res.json({
      message: "Document updated successfully.",
      document
    });
  } catch (err) {
    next(err);
  }
};



// Delete
exports.deleteDocument = async (req, res,next) => {
  try {
    const Documents = await Document.findByPk(req.params.id);
    if (!Documents){   const error = new Error( "Document entry not found" );
       error.status = 404;
      return next(error)}
    await Documents.destroy();
    res.json({ message: "Document entry deleted" });
  } catch (error) {
    next(error)
  }
};