// serviciosController.js

// Datos de ejemplo - reemplazar con consultas a la base de datos
const serviciosEjemplo = [
    {
        id: 1,
        vehiculo: {
            placa: "ABC-123",
            marca: "Toyota",
            modelo: "Corolla",
            anio: 2020
        },
        tipoServicio: "Cambio de aceite",
        fechaServicio: "2025-05-15",
        horaServicio: "09:00",
        duracionEstimada: "1.5 horas",
        costo: 45000,
        estado: "programado", // programado, urgente, completado
        descripcion: "Cambio de aceite y filtro",
        mecanico: "Juan Pérez",
        observaciones: "Revisar nivel de líquidos"
    },
    {
        id: 2,
        vehiculo: {
            placa: "XYZ-789",
            marca: "Honda",
            modelo: "Civic",
            anio: 2019
        },
        tipoServicio: "Revisión de frenos",
        fechaServicio: "2025-05-20",
        horaServicio: "14:00",
        duracionEstimada: "2 horas",
        costo: 85000,
        estado: "urgente",
        descripcion: "Revisión completa del sistema de frenos",
        mecanico: "María García",
        observaciones: "Cliente reporta ruidos extraños"
    },
    {
        id: 3,
        vehiculo: {
            placa: "DEF-456",
            marca: "Nissan",
            modelo: "Sentra",
            anio: 2021
        },
        tipoServicio: "Mantenimiento general",
        fechaServicio: "2025-05-08",
        horaServicio: "08:30",
        duracionEstimada: "3 horas",
        costo: 120000,
        estado: "completado",
        descripcion: "Mantenimiento preventivo completo",
        mecanico: "Carlos López",
        observaciones: "Servicio completado satisfactoriamente"
    },
    {
        id: 4,
        vehiculo: {
            placa: "GHI-101",
            marca: "Chevrolet",
            modelo: "Aveo",
            anio: 2018
        },
        tipoServicio: "Cambio de llantas",
        fechaServicio: "2025-05-25",
        horaServicio: "10:00",
        duracionEstimada: "1 hora",
        costo: 200000,
        estado: "programado",
        descripcion: "Cambio de las 4 llantas",
        mecanico: "Ana Rodríguez",
        observaciones: "Llantas nuevas ya ordenadas"
    }
];

// Helper para registrar un helper de Handlebars
const registerHandlebarsHelpers = () => ({
    eq: function (a, b) {
        return a === b;
    },
    formatNumber: function (number) {
        return number.toLocaleString();
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
        const serviciosDelDia = servicios.filter(s => s.fechaServicio === fechaCompleta)
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

        // En producción, aquí irían las consultas a la base de datos
        // const servicios = await ServicioModel.findAll({ where: filtros });
        let servicios = [...serviciosEjemplo];

        // Aplicar filtro de vehículo si existe
        if (vehiculoFiltro) {
            servicios = servicios.filter(s => s.vehiculo.placa === vehiculoFiltro);
        }

        // Obtener vehículos únicos para el filtro
        const vehiculosUnicos = [...new Set(serviciosEjemplo.map(s => s.vehiculo.placa))]
            .map(placa => {
                const vehiculo = serviciosEjemplo.find(s => s.vehiculo.placa === placa).vehiculo;
                return {
                    ...vehiculo,
                    selected: placa === vehiculoFiltro
                };
            });

        // Calcular estadísticas
        const serviciosMes = servicios.filter(servicio => {
            const fechaServicio = new Date(servicio.fechaServicio);
            return fechaServicio.getMonth() === mesActual && fechaServicio.getFullYear() === anioActual;
        });

        const estadisticas = {
            totalServicios: servicios.length,
            serviciosMes: serviciosMes.length,
            costoTotal: serviciosMes.reduce((total, s) => total + s.costo, 0).toLocaleString(),
            vehiculosActivos: new Set(servicios.map(s => s.vehiculo.placa)).size
        };

        // Generar calendario
        const diasCalendario = generarCalendario(mesActual, anioActual, servicios);

        // Generar años disponibles
        const anioMinimo = Math.min(...serviciosEjemplo.map(s => new Date(s.fechaServicio).getFullYear()));
        const anioMaximo = Math.max(...serviciosEjemplo.map(s => new Date(s.fechaServicio).getFullYear())) + 1;
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
const mostrarFormularioNuevo = (req, res) => {
    try {
        const datosVista = {
            titulo: 'Nuevo Servicio',
            accion: '/servicios',
            metodo: 'POST',
            servicio: {
                vehiculo: {},
                tipoServicio: '',
                fechaServicio: '',
                horaServicio: '',
                duracionEstimada: '',
                costo: 0,
                estado: 'programado',
                descripcion: '',
                mecanico: '',
                observaciones: ''
            }
        };

        res.render('services/form', datosVista);

    } catch (error) {
        console.error('Error al mostrar formulario:', error);
        res.status(500).render('error', {
            message: 'Error al cargar el formulario',
            error: error
        });
    }
};

// Controlador para mostrar formulario de edición
const mostrarFormularioEdicion = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // En producción: const servicio = await ServicioModel.findByPk(id);
        const servicio = serviciosEjemplo.find(s => s.id === id);

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
            id: Date.now(), // En producción se genera automáticamente
            costo: parseFloat(req.body.costo)
        };

        // En producción: await ServicioModel.create(nuevoServicio);
        serviciosEjemplo.push(nuevoServicio);

        res.redirect('/servicios/list?success=created');

    } catch (error) {
        console.error('Error al crear servicio:', error);
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

        // En producción: await ServicioModel.update(req.body, { where: { id } });
        const indice = serviciosEjemplo.findIndex(s => s.id === id);
        if (indice !== -1) {
            serviciosEjemplo[indice] = {
                ...serviciosEjemplo[indice],
                ...req.body,
                costo: parseFloat(req.body.costo)
            };
        }

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

        // En producción: await ServicioModel.destroy({ where: { id } });
        const indice = serviciosEjemplo.findIndex(s => s.id === id);
        if (indice !== -1) {
            serviciosEjemplo.splice(indice, 1);
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

        let servicios = [...serviciosEjemplo];

        if (vehiculoFiltro) {
            servicios = servicios.filter(s => s.vehiculo.placa === vehiculoFiltro);
        }

        const serviciosMes = servicios.filter(servicio => {
            const fechaServicio = new Date(servicio.fechaServicio);
            return fechaServicio.getMonth() === mesActual && fechaServicio.getFullYear() === anioActual;
        });

        res.json({
            servicios: serviciosMes,
            estadisticas: {
                totalServicios: servicios.length,
                serviciosMes: serviciosMes.length,
                costoTotal: serviciosMes.reduce((total, s) => total + s.costo, 0),
                vehiculosActivos: new Set(servicios.map(s => s.vehiculo.placa)).size
            }
        });

    } catch (error) {
        console.error('Error en API de servicios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export {
    listarServicios,
    mostrarFormularioNuevo,
    mostrarFormularioEdicion,
    crearServicio,
    actualizarServicio,
    eliminarServicio,
    obtenerServiciosAPI,
    registerHandlebarsHelpers
};