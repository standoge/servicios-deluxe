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
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
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
    lastname: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    dui: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    license: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'drivers',
    schema: 'public',
    timestamps: false,
    indexes: [
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
