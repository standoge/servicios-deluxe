import { Router } from 'express';
import { createRequire } from 'module';
import sequelize from '../../config/sequelize.js';
const require = createRequire(import.meta.url);
const initModelsFunction = require('../../models/init-models.cjs');

const models = initModelsFunction(sequelize);
const Driver = models.drivers;

const router = Router();

router.get('/form/add', async (req, res) => {
  try {
    res.render('drivers/form',{
      accion: 'conductor',
      metodo: 'POST',
      conductor: {
        id: '',
        name: '',
        birthdate: '',
        driver_id: '',
        phone: ''
      }
    })
  } catch (error) {
    console.log('Error al mostrar formulario nuevo', error);
        res.status(500).render('error', { 
            message: "Error al mostrar formulario nuevo",
            error: error
    });
  }
});

router.get('/form/:id', async (req, res) => {
  try {
    const conductor = await Driver.findByPk(req.params.id);
    if (!conductor) {
        return res.status(404).render('error', { 
            message: "Conductor no encontrado"
        });
    }

    res.render('drivers/form',{
        accion: 'conductor',
        metodo: 'POST',
        conductor
    })
  } catch (error) {
    console.log('Error al mostrar formulario nuevo', error);
        res.status(500).render('error', { 
            message: "Error al mostrar formulario nuevo",
            error: error
        });
  }
});

// CREATE 
router.post('/', async (req, res) => {
  const { name, birthdate, driver_id, phone } = req.body;

  if (!name || !birthdate || !driver_id || !phone) {
    return res.status(400).json({
      success: false,
      message: 'El nombre, fecha de nacimiento, licencia de conducir y teléfono son obligatorios'
    });
  }

  try {
    const existingDriverByLicense = await Driver.findOne({ where: { driver_id} });
    if (existingDriverByLicense) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un conductor con esa licencia de conducir'
      });
    }

    const existingDriverByName = await Driver.findOne({ where: { name } });
    if (existingDriverByName) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un conductor con ese nombre'
      });
    }

    const existingDriverByPhone = await Driver.findOne({ where: { phone } });
    if (existingDriverByPhone) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un conductor con ese número de teléfono'
      });
    }

    const newDriver = await Driver.create({
      driver_id: driver_id, // driver_id = driver_license
      name,
      birthdate,
      phone,
      active: true
    });

    res.status(201).json({
      success: true,
      message: 'Conductor creado exitosamente',
      driver: {
        driver_id: newDriver.driver_id,
        name: newDriver.name,
        birthdate: newDriver.birthdate,
        phone: newDriver.phone,
        active: newDriver.active
      }
    });
  } catch (error) {
    console.error('El conductor no pudo ser creado:', error);
    res.status(500).json({
      success: false,
      message: 'Error en la creación del conductor'
    });
  }
});

// READ ALL
router.get('/list', async (req, res) => {
  try {
    const conductores = await Driver.findAll({
      where: {
        active: true
      },
      attributes: ['driver_id', 'name', 'birthdate',  'phone', 'active']
    });

    res.render('drivers/list', {
      conductores,
      conductoresJSON: JSON.stringify(conductores)
    });
  } catch (error) {
    console.error('Error al obtener conductores:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener conductores'
    });
  }
});

// READ ONE
router.get('/:license', async (req, res) => {
  const { license } = req.params;

  try {
    const driver = await Driver.findOne({
      where: {
        driver_id: license,
        active: true
      },
      attributes: ['driver_id', 'name', 'birthdate', 'phone', 'active']
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Conductor no encontrado'
      });
    }

    res.json({
      success: true,
      driver
    });
  } catch (error) {
    console.error('Error al obtener conductor:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener conductor'
    });
  }
});

// UPDATE 
router.post('/:license', async (req, res) => {
  const { license } = req.params;
  const { name, birthdate, phone } = req.body;

  try {
    const driver = await Driver.findOne({
      where: {
        driver_id: license,
        active: true
      }
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Conductor no encontrado'
      });
    }

    const updateData = {};

    // Update name
    if (name) {
      const existingDriver = await Driver.findOne({
        where: {
          name,
          driver_id: { [sequelize.Sequelize.Op.ne]: license }
        }
      });

      if (existingDriver) {
        return res.status(409).json({
          success: false,
          message: 'No se puede actualizar el conductor, ya que el nombre ya existe'
        });
      }

      updateData.name = name;
    }

    // Update birthdate
    if (birthdate) {
      updateData.birthdate = birthdate;
    }

    // Update phone
    if (phone) {
      const existingDriver = await Driver.findOne({
        where: {
          phone,
          driver_id: { [sequelize.Sequelize.Op.ne]: license }
        }
      });

      if (existingDriver) {
        return res.status(409).json({
          success: false,
          message: 'No se puede actualizar el conductor, ya que el teléfono ya existe'
        });
      }

      updateData.phone = phone;
    }

    await driver.update(updateData);

    res.json({
      success: true,
      message: 'Conductor actualizado exitosamente',
      driver: {
        driver_id: driver.driver_id,
        name: driver.name,
        birthdate: driver.birthdate,
        phone: driver.phone,
        active: driver.active
      }
    });
  } catch (error) {
    console.error('Error al actualizar el conductor:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el conductor'
    });
  }
});

// DELETE 
router.delete('/:license', async (req, res) => {
  const { license } = req.params;

  try {
    const driver = await Driver.findOne({
      where: {
        driver_id: license,
        active: true
      }
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Conductor no encontrado'
      });
    }

    await driver.update({ active: false });

    res.json({
      success: true,
      message: 'Conductor eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar conductor:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar conductor'
    });
  }
});

export default router;

