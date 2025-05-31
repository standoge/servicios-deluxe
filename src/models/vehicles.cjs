const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vehicles', {
    vehicle_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    marca: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    modelo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    anio: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    placa: {
      type: DataTypes.STRING(20),
      allowNull: false
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
