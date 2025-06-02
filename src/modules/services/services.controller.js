// serviciosController.js
import {
    createService,
    getAllServices,
    updateService,
    deleteService,
    getServiceById
} from './services.service.js';
import sequelize from '../../config/sequelize.js';
import initModels from '../../models/init-models.cjs'; // <-- Importación correcta
import { getAllVehicles } from '../vehicles/vehicles.service.js'; // Importa el servicio de vehículos

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
        }
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
        const serviciosDelDia = servicios.filter(s => s.fecha_servicio === fechaCompleta)
            .map(servicio => ({
                ...servicio,
                costoFormateado: servicio.costo.toLocaleString()
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
            costoTotal: serviciosMes.reduce((total, s) => total + s.costo, 0).toLocaleString(),
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

        // Preparar datos para la vista
        const datosVista = {
            servicios,
            vehiculos: vehiculosUnicos,
            estadisticas,
            diasCalendario,
            mesActual,
            anioActual,
            mesNombre: meses[mesActual],
            aniosDisponibles,
            serviciosJSON: JSON.stringify(servicios) // Para pasar al cliente
        };

        res.render('services/list', datosVista);

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
        const vehiculos = await getAllVehicles(); // Obtén todos los vehículos
        const viaje = req.params.id ? await getViajeById(req.params.id) : null; // Si hay un ID, busca el viaje
        res.render('viaje/form', { viaje, vehiculos }); // Pasa los vehículos y el viaje a la vista
    } catch (error) {
        res.status(500).render('error', {
            message: "Error al cargar el formulario de viaje",
            error: error
        });
    }
};

// Controlador para mostrar formulario de edición
const mostrarFormularioEdicion = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const servicio = await getServiceById(id);

        if (!servicio) {
            return res.status(404).render('error', {
                message: 'Servicio no encontrado'
            });
        }

        const datosVista = {
            titulo: 'Editar Servicio',
            accion: `/servicios/${id}`,
            metodo: 'PUT',
            servicio
        };

        res.render('services/form', datosVista);

    } catch (error) {
        console.error('Error al cargar servicio para edición:', error);
        res.status(500).render('error', {
            message: 'Error al cargar el servicio',
            error: error
        });
    }
};

// Controlador para crear nuevo servicio
const crearServicio = async (req, res) => {
    try {
        const nuevoServicio = {
            ...req.body,
            vehicle_id: parseInt(req.body.vehicle_id),
            costo: parseFloat(req.body.costo)
        };

        await createService(nuevoServicio);

        // Si la petición es AJAX (fetch), responde con JSON
        if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
            return res.status(200).json({ success: true, message: 'Servicio guardado exitosamente' });
        }

        // Si es un form tradicional, redirige
        res.redirect('/servicios/list?success=created');

    } catch (error) {
        console.error('Error al crear servicio:', error);

        // Si la petición es AJAX (fetch), responde con JSON de error
        if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
            return res.status(400).json({ success: false, message: error.message || 'Error al crear el servicio' });
        }

        res.status(500).render('error', {
            message: 'Error al crear el servicio',
            error: error
        });
    }
};

// Controlador para actualizar servicio
const actualizarServicio = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const indice = getServiceById(id);
        if (indice !== -1) {
            updateService(id, req.body);
        };

        res.redirect('/servicios/list?success=updated');

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
                costoTotal: serviciosMes.reduce((total, s) => total + s.costo, 0),
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