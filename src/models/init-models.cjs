// Siempre colocar extensión .cjs para evitar problemas con importaciones en Node.js
var DataTypes = require("sequelize").DataTypes;
var _customers = require("./customers.cjs");
var _drivers = require("./drivers.cjs");
var _services = require("./services.cjs");
var _users = require("./users.cjs");
var _vehicles = require("./vehiculos.cjs");

function initModels(sequelize) {
  var customers = _customers(sequelize, DataTypes);
  var drivers = _drivers(sequelize, DataTypes);
  var services = _services(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var vehicles = _vehicles(sequelize, DataTypes);

  // Relación services -> vehicles (existente)
  services.belongsTo(vehicles, { as: "vehiculos", foreignKey: "vehicle_id"});
  vehicles.hasMany(services, { as: "services", foreignKey: "vehicle_id"});

  // Relación services -> customers
  services.belongsTo(customers, { as: "customer", foreignKey: "customer_id"});
  customers.hasMany(services, { as: "services", foreignKey: "customer_id"});

  return {
    customers,
    drivers,
    services,
    users,
    vehicles,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;