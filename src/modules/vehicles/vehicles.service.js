// vehicles.service.js

import { createRequire } from "module";
import sequelize from "../../config/sequelize.js";
const require = createRequire(import.meta.url);
const initModelsFunction = require('../../models/init-models.cjs');

const models = initModelsFunction(sequelize);
const Vehicle = models.vehicles;

const createVehicle = async (vehicleData) => Vehicle.create(vehicleData);

const getAllVehicles = async () => Vehicle.findAll();

const getVehicleById = async (id) => Vehicle.findByPk(id);

const updateVehicle = async (id, vehicleData) => {
  const vehicle = await Vehicle.findByPk(id);
  return vehicle ? vehicle.update(vehicleData) : null;
};

const deleteVehicle = async (id) => Vehicle.destroy({ where: { vehicle_id: id } });

export {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
};