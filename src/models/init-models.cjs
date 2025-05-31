var DataTypes = require("sequelize").DataTypes;
var _users = require("./users.cjs");
var _vehicles = require("./vehicles.cjs");

function initModels(sequelize) {
  var users = _users(sequelize, DataTypes);
  var vehicles = _vehicles(sequelize, DataTypes);

  services.belongsTo(vehicles, { as: "vehicle", foreignKey: "vehicle_id"});
  vehicles.hasMany(services, { as: "services", foreignKey: "vehicle_id"});


  return {
    services,
    users,
    vehicles,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
