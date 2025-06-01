// Siempre colocar extensión .cjs para evitar problemas con importaciones en Node.js
var DataTypes = require("sequelize").DataTypes;
var _services = require("./services.cjs");
var _users = require("./users.cjs");
var _vehicles = require("./vehiculos.cjs");

function initModels(sequelize) {
  var services = _services(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var vehicles = _vehicles(sequelize, DataTypes);

  services.belongsTo(vehicles, { as: "vehiculos", foreignKey: "vehicle_id"});
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
