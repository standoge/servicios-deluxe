// serviciosController.js
import {
    createService,
    getAllServices,
    updateService,
    deleteService,
    getServiceById
} from './services.service.js';
import sequelize from '../../config/sequelize.js';
import initModels from '../../models/init-models.cjs';
import { getAllVehicles } from '../vehicles/vehicles.service.js';
import { getAllCustomers } from '../customers/customers.service.js';

const models = initModels(sequelize);

const Servicio = models.services;
const Vehiculo = models.vehicles;

// Helper para registrar un helper de Handlebars
const registerHandlebarsHelpers = () => ({
    eq: function (a, b) {
        return a === b;
    },
    formatNumber: function (number) {
        return number.toLocaleString();
    },
    ifeq: function (a, b, options) {
        return a === b ? options.fn(this) : options.inverse(this);
    },
});

// Función para generar el calendario
const generarCalendario = (mes, anio, servicios) => {
    const primerDia = new Date(anio, mes, 1);
    const ultimoDia = new Date(anio, mes + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const diaSemanaInicio = primerDia.getDay();

    const dias = [];

    // Días del mes anterior
    const ultimoDiaMesAnterior = new Date(anio, mes, 0).getDate();
    for (let i = diaSemanaInicio - 1; i >= 0; i--) {
        dias.push({
            numero: ultimoDiaMesAnterior - i,
            otroMes: true,
            servicios: []
        });
    }

    // Días del mes actual
    for (let dia = 1; dia <= diasEnMes; dia++) {
        const fechaCompleta = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

        const serviciosDelDia = servicios.filter(s => {
            // Asegurar que la fecha del servicio esté en formato YYYY-MM-DD
            const fechaServicio = new Date(s.fecha_servicio);
            const fechaServicioFormateada = `${fechaServicio.getFullYear()}-${String(fechaServicio.getMonth() + 1).padStart(2, '0')}-${String(fechaServicio.getDate()).padStart(2, '0')}`;
            return fechaServicioFormateada === fechaCompleta;
        }).map(servicio => ({
            ...servicio.toJSON(),
            costoFormateado: servicio.costo.toLocaleString(),
            vehiculos: servicio.vehiculos ? servicio.vehiculos.toJSON() : { placa: 'N/A' }
        }));

        dias.push({
            numero: dia,
            otroMes: false,
            servicios: serviciosDelDia
        });
    }

    // Días del mes siguiente
    const celdasRestantes = 42 - (diaSemanaInicio + diasEnMes);
    for (let dia = 1; dia <= celdasRestantes; dia++) {
        dias.push({
            numero: dia,
            otroMes: true,
            servicios: []
        });
    }
    return dias;
};

// Controlador principal para la lista de servicios
const listarServicios = async (req, res) => {
    try {
        // Obtener parámetros de consulta
        const mesActual = parseInt(req.query.mes) || new Date().getMonth();
        const anioActual = parseInt(req.query.anio) || new Date().getFullYear();
        const vehiculoFiltro = req.query.vehiculo || '';

        let servicios = await getAllServices();

        // Aplicar filtro de vehículo si existe
        if (vehiculoFiltro) {
            servicios = servicios.filter(s => s.vehiculos && s.vehiculos.placa === vehiculoFiltro);
        }

        // Obtener vehículos únicos para el filtro
        const vehiculosUnicos = [...new Set(servicios.map(s => s.vehiculos?.placa))]
            .filter(Boolean)
            .map(placa => {
                const vehiculo = servicios.find(s => s.vehiculos && s.vehiculos.placa === placa)?.vehiculos?.toJSON?.() || {};
                return {
                    ...vehiculo,
                    selected: placa === vehiculoFiltro
                };
            });

        // Calcular estadísticas
        const serviciosMes = servicios.filter(servicio => {
            const fechaServicio = new Date(servicio.fecha_servicio);
            return fechaServicio.getMonth() === mesActual && fechaServicio.getFullYear() === anioActual;
        });

        const estadisticas = {
            totalServicios: servicios.length,
            serviciosMes: serviciosMes.length,
            costoTotal: serviciosMes.reduce((total, s) => {
                // Convertir el costo a número (float) antes de sumar
                const costoNumerico = parseFloat(s.costo) || 0;
                return total + costoNumerico;
            }, 0).toLocaleString(),
            vehiculosActivos: new Set(servicios.map(s => s.vehiculos?.placa).filter(Boolean)).size
        };

        // Generar calendario
        const diasCalendario = generarCalendario(mesActual, anioActual, servicios);

        // Generar años disponibles
        const anioMinimo = Math.min(...servicios.map(s => new Date(s.fecha_servicio).getFullYear()));
        const anioMaximo = Math.max(...servicios.map(s => new Date(s.fecha_servicio).getFullYear())) + 1;
        const aniosDisponibles = [];
        for (let anio = anioMinimo; anio <= anioMaximo; anio++) {
            aniosDisponibles.push(anio);
        }

        // Nombres de meses
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        res.render('viajes/list', {
            servicios: [],
            nonce: res.locals.nonce,
            vehiculos: vehiculosUnicos,
            estadisticas,
            diasCalendario,
            mesActual,
            anioActual,
            mesNombre: meses[mesActual],
            aniosDisponibles,
            serviciosJSON: JSON.stringify(servicios.map(s => ({
                ...s.toJSON(),
                vehiculos: s.vehiculos ? s.vehiculos.toJSON() : null
            })))
        });

    } catch (error) {
        console.error('Error al listar servicios:', error);
        res.status(500).render('error', {
            message: 'Error al cargar los servicios',
            error: error
        });
    }
};

// Controlador para mostrar formulario de nuevo servicio
const mostrarFormularioViaje = async (req, res) => {
    try {
        // Obtener vehículos REALES de la base de datos
        const vehiculos = await getAllVehicles();
        const clientes = await getAllCustomers();

        const viaje = req.params.id ? await getServiceById(req.params.id) : null;

        res.render('viajes/form', {
            viaje,
            vehiculos, // Enviar los vehículos reales
            clientes,
            titulo: viaje ? 'Editar Viaje' : 'Nuevo Viaje',
            accion: viaje ? `/viajes/${viaje.id}` : '/viajes',
            metodo: viaje ? 'PUT' : 'POST'
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('error', {
            message: "Error al cargar el formulario",
            error: error
        });
    }
};

// Controlador para mostrar formulario de edición
const mostrarFormularioEdicion = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const vehiculos = await getAllVehicles();
        const clientes = await getAllCustomers();
        const viaje = await getServiceById(id);

        if (!viaje) {
            return res.status(404).render('error', {
                message: 'Viaje no encontrado'
            });
        }

        // Debug: Ver los datos del viaje
        res.render('viajes/form', {
            viaje: {
                ...viaje.toJSON(),
                // Asegura que estos campos existan
                origen: viaje.origen || '',
                destino: viaje.destino || '',
                // Formatea la fecha para el input datetime-local
                fecha_salida: viaje.fecha_servicio && viaje.hora_servicio
                    ? `${viaje.fecha_servicio}T${viaje.hora_servicio}`
                    : ''
            },
            vehiculos,
            clientes,
            titulo: 'Editar Viaje',
            accion: `/viajes/${id}`,
            metodo: 'POST'
        });

    } catch (error) {
        console.error('Error al cargar viaje para edición:', error);
        res.status(500).render('error', {
            message: 'Error al cargar el viaje',
            error: error
        });
    }
};

// Controlador para crear nuevo servicio
const crearServicio = async (req, res) => {
    try {
        // Validación mejorada
        if (!req.body.vehicle_id) {
            return res.status(400).json({
                success: false,
                message: 'Debe seleccionar un vehículo'
            });
        }

        if (!req.body.customer_id || req.body.customer_id === 'nuevo') {
            return res.status(400).json({
                success: false,
                message: 'Debe seleccionar un cliente existente o crear uno nuevo'
            });
        }

        // Mapeo de datos
        const nuevoServicio = {
            vehicle_id: parseInt(req.body.vehicle_id),
            customer_id: parseInt(req.body.customer_id),
            tipo_servicio: 'Viaje',
            fecha_servicio: req.body.fecha_salida?.split('T')[0] || new Date().toISOString().split('T')[0],
            hora_servicio: req.body.fecha_salida?.split('T')[1] || '08:00',
            origen: req.body.origen,
            destino: req.body.destino,
            costo: parseFloat(req.body.costo) || 0,
            estado: req.body.estado || 'programado',
            observaciones: req.body.observaciones
        };

        await createService(nuevoServicio);
        res.redirect('/viajes/list?success=created');

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error al crear el servicio'
        });
    }
};

// Controlador para actualizar servicio
const actualizarServicio = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const servicio = await getServiceById(id);

        if (!servicio) {
            return res.status(404).json({ message: 'Servicio no encontrado' });
        }

        // Mapeo completo de datos
        const datosActualizados = {
            vehicle_id: parseInt(req.body.vehicle_id),
            customer_id: parseInt(req.body.customer_id),
            tipo_servicio: 'Viaje',
            fecha_servicio: req.body.fecha_salida?.split('T')[0] || servicio.fecha_servicio,
            hora_servicio: req.body.fecha_salida?.split('T')[1] || servicio.hora_servicio,
            origen: req.body.origen,
            destino: req.body.destino,
            costo: parseFloat(req.body.costo) || 0,
            estado: req.body.estado || servicio.estado,
            observaciones: req.body.observaciones
        };

        await updateService(id, datosActualizados);
        res.redirect('/viajes/list?success=updated');

    } catch (error) {
        console.error('Error al actualizar servicio:', error);
        res.status(500).render('error', {
            message: 'Error al actualizar el servicio',
            error: error
        });
    }
};

// Controlador para eliminar servicio
const eliminarServicio = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const indice = getServiceById(id);
        if (indice !== -1) {
            deleteService(id);
        }

        res.redirect('/servicios/list?success=deleted');

    } catch (error) {
        console.error('Error al eliminar servicio:', error);
        res.status(500).render('error', {
            message: 'Error al eliminar el servicio',
            error: error
        });
    }
};

// API para obtener servicios (AJAX)
const obtenerServiciosAPI = async (req, res) => {
    try {
        const mesActual = parseInt(req.query.mes) || new Date().getMonth();
        const anioActual = parseInt(req.query.anio) || new Date().getFullYear();
        const vehiculoFiltro = req.query.vehiculo || '';

        let servicios = await getAllServices();

        if (vehiculoFiltro) {
            servicios = servicios.filter(s => s.vehiculos && s.vehiculos.placa === vehiculoFiltro);
        }

        const serviciosMes = servicios.filter(servicio => {
            const fechaServicio = new Date(servicio.fecha_servicio);
            return fechaServicio.getMonth() === mesActual && fechaServicio.getFullYear() === anioActual;
        });

        res.json({
            servicios: serviciosMes,
            estadisticas: {
                totalServicios: servicios.length,
                serviciosMes: serviciosMes.length,
                costoTotal: serviciosMes.reduce((total, s) => {
                    // Convertir el costo a número (float) antes de sumar
                    const costoNumerico = parseFloat(s.costo) || 0;
                    return total + costoNumerico;
                }, 0).toLocaleString(),
                vehiculosActivos: new Set(servicios.map(s => s.vehiculos?.placa).filter(Boolean)).size
            }
        });

    } catch (error) {
        console.error('Error en API de servicios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export {
    listarServicios,
    mostrarFormularioViaje,
    mostrarFormularioEdicion,
    crearServicio,
    actualizarServicio,
    eliminarServicio,
    obtenerServiciosAPI,
    registerHandlebarsHelpers
};