var DataTypes = require("sequelize").DataTypes;
var _drivers = require("./drivers.cjs");
var _users = require("./users.cjs");
var _vehicles = require("./vehicles.cjs");

function initModels(sequelize) {
  var drivers = _drivers(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var vehicles = _vehicles(sequelize, DataTypes);


  return {
    drivers,
    users,
    vehicles,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
