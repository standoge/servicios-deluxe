// services.service.js

import { createRequire } from "module";
import sequelize from "../../config/sequelize.js";
import vehicles from "../../models/vehiculos.cjs";
const require = createRequire(import.meta.url);
const initModelsFunction = require('../../models/init-models.cjs');

const models = initModelsFunction(sequelize);
const Service = models.services;

const createService = async (serviceData) => Service.create(serviceData);

const getAllServices = async () => Service.findAll({ include: { model: models.vehicles, as: "vehiculos" } });

const getServiceById = async (id) => Service.findByPk(id);

const updateService = async (id, serviceData) => {
  const Service = await Service.findByPk(id);
  return Service ? Service.update(serviceData) : null;
};

const deleteService = async (id) => Service.destroy({ where: { id } });

export {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService
};