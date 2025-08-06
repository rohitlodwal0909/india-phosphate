const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { HSN ,User } = db;

// Create
exports.create = async (req, res,next) => {
  try {
    const data = await HSN.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err)
  }
};

exports.findAll = async (req, res,next) => {
  try {
    const data = await HSN.findAll();
     const resultWithUsernames = await Promise.all(
      data.map(async (make) => {
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
  } catch (err) {
    next(err)
  }
};

exports.findOne = async (req, res,next) => {
  try {
    const data = await HSN.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: "HSN not found" });
    res.status(200).json(data);
  } catch (err) {
    next(err)
  }
};

exports.update = async (req, res,next) => {
  try {
    const updated = await HSN.update(req.body, {
      where: { id: req.params.id }
    });
    res.status(200).json({ message: "HSN updated successfully" });
  } catch (err) {
    next(err)
  }
};

exports.delete = async (req, res,next) => {
  try {
    await HSN.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "HSN deleted successfully" });
  } catch (err) {
    next(err)
  }
};