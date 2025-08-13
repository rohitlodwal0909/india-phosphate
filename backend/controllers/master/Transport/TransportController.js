const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { Transport ,User} = db;

// Create
exports.createTransport = async (req, res,next ) => {
  try {

    const newTransport = await Transport.create(req.body);

            const user_id = req.body?.created_by|| newTransport.created_by 
      const user = await User.findByPk(user_id);
     const username = user ? user.username : "Unknown User";
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage =  `Transport name '${req.body?.transporter_name}' was created by '${username}' on ${entry_date} at ${entry_time}.`;
        await createLogEntry({ user_id: user_id, message: logMessage });
    res.status(201).json(newTransport);
  } catch (error) {
   next(error)
  }
};

exports.getTransportById = async (req, res,next) => {
  try {
    const Transports = await Transport.findByPk(req.params.id);
    if (!Transports){
      const error = new Error( "Transport entry not found");
       error.status = 404;
      return next(error); 
    }
    res.json(Transports);
  } catch (error) {
   next(error)
  }
};

// Read By ID
exports.getAllTransport = async (req, res,next ) => {
  try {
     const transporter = await Transport.findAll();
 const resultWithUsernames = await Promise.all(
      transporter.map(async (make) => {
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
exports.updateTransport = async (req, res, next) => {
  try {
    const transporter_id = req.params.id;
    const Transports = await Transport.findByPk(transporter_id);

    if (!Transports) {
      const error = new Error("Transport entry not found");
      error.status = 404;
      return next(error);
    }

    const {
      transporter_name,
      contact_person,
      address,
      city,
      state,
      pincode,
      email,
      gst_number,
      pan_number,
      created_by,
      is_active,
      contact_number,
      alternate_number,
      vehicle_types,
       payment_terms,
      preferred_routes,
      freight_rate_type,
      date,
      time
    } = req.body;
    const user_id = req.body?.created_by || Transports.created_by 
      const user = await User.findByPk(user_id);
     const username = user ? user.username : "Unknown User";
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage =  `Transport name '${transporter_name}' was updated by '${username}' on ${entry_date} at ${entry_time}.`;
        await createLogEntry({ user_id: user_id, message: logMessage });
    await Transports.update({
      transporter_name,
      contact_person,
      address,
      city,
      state,
      pincode,
      email,
      gst_number,
      pan_number,
      created_by,
      is_active,
      contact_number,
      alternate_number,
      vehicle_types,
       payment_terms,
      preferred_routes,
      freight_rate_type,
      date,
      time
    });

    res.status(200).json({ message: "Transport updated successfully", data: Transports });
  } catch (error) {
    next(error);
  }
};



// Delete
exports.deleteTransport = async (req, res,next) => {
  try {
    const Transports = await Transport.findByPk(req.params.id);
    if (!Transports)
     {
       const error = new Error( "Transport entry not found");
       error.status = 404;
      return next(error); 
     }
      const user_id = req.body?.user_id || Transports.created_by 
      const user = await User.findByPk(user_id);
     const username = user ? user.username : "Unknown User";
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage =  `Transport name '${Transports?.transporter_name}' was deleted by '${username}' on ${entry_date} at ${entry_time}.`;
        await createLogEntry({ user_id: user_id, message: logMessage });
    await Transports.destroy();
    res.json({ message: "Transport entry deleted" });
  } catch (error) {
   next(error)
  }
};