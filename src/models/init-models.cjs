var DataTypes = require("sequelize").DataTypes;
var _drivers = require("./drivers.cjs");

function initModels(sequelize) {
  var drivers = _drivers(sequelize, DataTypes);

  drivers.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(drivers, { as: "drivers", foreignKey: "user_id"});
  drivers.belongsTo(vehicles, { as: "vehicle", foreignKey: "vehicle_id"});
  vehicles.hasMany(drivers, { as: "drivers", foreignKey: "vehicle_id"});

  return {
    drivers,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
