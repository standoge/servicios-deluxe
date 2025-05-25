const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vehicles', {
    vehicle_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'vehicles',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "vehicle_pkey",
        unique: true,
        fields: [
          { name: "vehicle_id" },
        ]
      },
    ]
  });
};
