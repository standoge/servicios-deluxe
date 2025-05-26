// Siempre colocar extensión .cjs para evitar problemas con importaciones en Node.js
var DataTypes = require("sequelize").DataTypes;
var _drivers = require("./drivers.cjs");
var _roles = require("./roles.cjs");
var _users = require("./users.cjs");
var _vehicles = require("./vehicles.cjs");

function initModels(sequelize) {
  var drivers = _drivers(sequelize, DataTypes);
  var roles = _roles(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var vehicles = _vehicles(sequelize, DataTypes);

  users.belongsTo(roles, { as: "role", foreignKey: "role_id"});
  roles.hasMany(users, { as: "users", foreignKey: "role_id"});

  return {
    drivers,
    roles,
    users,
    vehicles,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
