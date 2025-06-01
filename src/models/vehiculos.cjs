const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vehiculos', {
    vehicle_id: { // Cambiado de id_vehiculo a vehicle_id
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    placa: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    marca: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    modelo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    anio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1900,
        max: new Date().getFullYear() + 1
      }
    },
    color: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    tipo_vehiculo: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    tipo_combustible: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    kilometraje: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    capacidad_pasajeros: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      validate: {
        min: 1
      }
    },
    numero_puertas: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      validate: {
        min: 1,
        max: 6
      }
    },
    transmision: {
      type: DataTypes.STRING(10),
      allowNull: true,
      validate: {
        isIn: [['Automática', 'Manual', 'CVT', 'Semi-auto']]
      }
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [['Nuevo', 'Usado', 'Reparado', 'Chocado', 'Robado']]
      }
    },
    fecha_compra: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ultimo_mantenimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    seguro_vigente: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    poliza_seguro: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'vehiculos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "vehiculos_pkey",
        unique: true,
        fields: [
          { name: "vehicle_id" }, // Cambiado aquí también
        ]
      },
      {
        name: "vehiculos_placa_key",
        unique: true,
        fields: [
          { name: "placa" },
        ]
      }
    ]
  });
};