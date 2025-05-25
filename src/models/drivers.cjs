const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('drivers', {
    driver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "drivers_name_key"
    },
    birthdate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    driver_license: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "drivers_driver_license_key"
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    phone: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "drivers_phone_key"
    },
    vehicle_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'vehicles',
        key: 'vehicle_id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    }
  }, {
    sequelize,
    tableName: 'drivers',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "drivers_driver_license_key",
        unique: true,
        fields: [
          { name: "driver_license" },
        ]
      },
      {
        name: "drivers_name_key",
        unique: true,
        fields: [
          { name: "name" },
        ]
      },
      {
        name: "drivers_phone_key",
        unique: true,
        fields: [
          { name: "phone" },
        ]
      },
      {
        name: "drivers_pkey",
        unique: true,
        fields: [
          { name: "driver_id" },
        ]
      },
    ]
  });
};
