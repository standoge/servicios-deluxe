// services.service.js
import { createRequire } from "module";
import sequelize from "../../config/sequelize.js";
const require = createRequire(import.meta.url);
const initModelsFunction = require('../../models/init-models.cjs');

const models = initModelsFunction(sequelize);
const Service = models.services;

const createService = async (serviceData) => Service.create(serviceData);

const getAllServices = async () => Service.findAll({ 
  include: [
    { model: models.vehicles, as: "vehiculos" },
    { model: models.customers, as: "customer" }
  ] 
});

const getServiceById = async (id) => Service.findByPk(id, {
  include: [
    { model: models.vehicles, as: "vehiculos" },
    { model: models.customers, as: "customer" }
  ]
});

const updateService = async (id, serviceData) => {
  const service = await Service.findByPk(id);
  if (!service) return null;
  
  // Actualizar todos los campos
  return service.update({
    vehicle_id: serviceData.vehicle_id,
    customer_id: serviceData.customer_id,
    tipo_servicio: serviceData.tipo_servicio,
    fecha_servicio: serviceData.fecha_servicio,
    hora_servicio: serviceData.hora_servicio,
    origen: serviceData.origen,
    destino: serviceData.destino,
    costo: serviceData.costo,
    estado: serviceData.estado,
    observaciones: serviceData.observaciones
  });
};

const deleteService = async (id) => Service.destroy({ where: { id } });

export {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService
};