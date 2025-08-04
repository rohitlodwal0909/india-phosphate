const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { Company, User} = db;


// Create Company
exports.createCompany = async (req, res, next) => {
  try {
    const {
      company_code, company_name,address,city,state_id,country, pincode, email, phone,
      gst_number, cin_number,
      pan_number,created_by,status,
    } = req.body;
    // Check if company with same email already exists
    const existingCompany = await Company.findOne({ where: { email } });
    if (existingCompany) {
      const error = new Error("A company with this email already exists.");
      error.status = 400;
      return next(error);
    }
    // Create new company
    const newCompany = await Company.create({
      company_code,
      company_name,
      address,
      city,
      state_id,
      country,
      pincode,
      email,
      phone,
      gst_number,
      cin_number,
      pan_number,
      created_by,
      status
    });

    res.status(201).json(newCompany);
  } catch (error) {
    next(error);
  }
};


exports.getCompanyById = async (req, res,next) => {
  try {
    const Companybyid = await Company.findByPk(req.params.id);
    if (!Company){
       const error = new Error( "Company entry not found" );
       error.status = 404;
      return next(error); 
     }
    res.json(Companybyid);
  } catch (error) {
     next(error)
  }
};

// Read By ID
exports.getAllCompany = async (req, res,next) => {
  try {
    const Companyget = await Company.findAll({
      where: {
        deleted_at: null // optional: exclude soft-deleted records
      },
      order: [['created_at', 'DESC']]
    });
     const resultWithUsernames = await Promise.all(
      Companyget.map(async (make) => {
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
exports.updateCompany = async (req, res, next) => {
  try {
    const companyId = req.params.id;
    const existingCompany = await Company.findByPk(companyId);

    if (!existingCompany) {
      const error = new Error("Company entry not found");
      error.status = 404;
      return next(error);
    }

    const {
      company_code,
      company_name,
      address,
      city,
      state_id,
      country,
      pincode,
      email,
      phone,
      gst_number,
      cin_number,
      pan_number,
      created_by,
      status
    } = req.body;

    await existingCompany.update({
      company_code,
      company_name,
      address,
      city,
      state_id,
      country,
      pincode,
      email,
      phone,
      gst_number,
      cin_number,
      pan_number,
      created_by,
      status
    });
    res.json(existingCompany);
  } catch (error) {
    console.error("Update Company Error:", error);
    next(error);
  }
};


// Delete
exports.deleteCompany = async (req, res,next) => {
  try {
    const Companydel = await Company.findByPk(req.params.id);

    if (!Companydel){ const error = new Error( "Company entry not found" );
       error.status = 404;
      return next(error); 
     }
    
    await Companydel.destroy();
    res.json({ message: "Company entry deleted" });
  } catch (error) {
   next(error)
  }
};