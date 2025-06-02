const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('services', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    vehicle_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'vehiculos',
        key: 'vehicle_id'
      }
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'customers',
        key: 'customer_id'
      }
    },
    tipo_servicio: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    fecha_servicio: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    hora_servicio: {
      type: DataTypes.TIME,
      allowNull: false
    },
    duracion_estimada: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    costo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    origen: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    destino: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'services',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "services_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "idx_service_customer",
        fields: [
          { name: "customer_id" },
        ]
      },
    ]
  });
};