var DataTypes = require("sequelize").DataTypes;
var _drivers = require("./drivers");
var _roles = require("./roles");
var _users = require("./users");
var _vehicles = require("./vehicles");

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
