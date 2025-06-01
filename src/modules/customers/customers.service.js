// customers.service.js

import { createRequire } from "module";
import sequelize from "../../config/sequelize.js";
const require = createRequire(import.meta.url);
const initModelsFunction = require('../../models/init-models.cjs');

const models = initModelsFunction(sequelize);
const Customer = models.customers;

const createCustomer = async (customerData) => Customer.create(customerData);

const getAllCustomers = async () => Customer.findAll();

const getCustomerById = async (id) => Customer.findByPk(id);

const updateCustomer = async (id, customerData) => {
  const customer = await Customer.findByPk(id);
  return customer ? customer.update(customerData) : null;
};

const deleteCustomer = async (id) => Customer.destroy({ where: { customer_id: id }});

export {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
};