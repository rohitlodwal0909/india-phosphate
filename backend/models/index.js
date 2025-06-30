const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);

const sequelize = require("../config/db");
const db = {};

function loadModelsFromDirectory(directoryPath) {
  fs.readdirSync(directoryPath).forEach((file) => {
    const fullPath = path.join(directoryPath, file);

    if (fs.statSync(fullPath).isDirectory()) {
      loadModelsFromDirectory(fullPath);
    }

    if (
      file !== basename &&
      file.endsWith(".js") &&
      fs.statSync(fullPath).isFile()
    ) {
      console.log("Trying to load:", fullPath); // 👈 Add this line
      const model = require(fullPath)(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    }
  });
}

loadModelsFromDirectory(__dirname);

// Run associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
