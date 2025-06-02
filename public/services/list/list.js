// Variables globales
let servicios = [];
let mesActual = new Date().getMonth();
let anioActual = new Date().getFullYear();
let vehiculoFiltro = "";

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos del servidor
    cargarDatosDelServidor();
    
    // Event listeners
    document.getElementById('vehiculoFilter').addEventListener('change', filtrarServicios);
    document.getElementById('mesFilter').addEventListener('change', cambiarMes);
    document.getElementById('anioFilter').addEventListener('change', cambiarAnio);
    document.getElementById('prevMes').addEventListener('click', mesAnterior);
    document.getElementById('nextMes').addEventListener('click', mesSiguiente);
    document.getElementById('hoyBtn').addEventListener('click', irAHoy);
});

function cargarDatosDelServidor() {
    try {
        const scriptElement = document.getElementById('serviciosData');
        if (scriptElement) {
            let rawData = scriptElement.textContent.replace(/<\/?[^>]+(>|$)/g, "").trim();
            servicios = JSON.parse(rawData);
            
            // Aseguramos que las fechas tengan formato correcto
            servicios.forEach(s => {
                if (s.fecha_servicio) {
                    const d = new Date(s.fecha_servicio);
                    // Forzamos formato YYYY-MM-DD
                    s.fecha_servicio = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                }
            });
        }
        actualizarCalendario();
        actualizarEstadisticas();
    } catch (error) {
        console.error('Error cargando datos:', error);
        servicios = [];
    }
}

function editarServicio(id) {
    window.location.href = `/viajes/editar/${id}`;
}

function filtrarServicios() {
    vehiculoFiltro = document.getElementById('vehiculoFilter').value;
    actualizarCalendario();
    actualizarEstadisticas();
    
    // Hacer petición al servidor para actualizar la vista
    const url = new URL(window.location);
    if (vehiculoFiltro) {
        url.searchParams.set('vehiculo', vehiculoFiltro);
    } else {
        url.searchParams.delete('vehiculo');
    }
    window.history.pushState({}, '', url);
}

function cambiarMes() {
    mesActual = parseInt(document.getElementById('mesFilter').value);
    actualizarCalendario();
    actualizarEstadisticas();
    actualizarURL();
}

function cambiarAnio() {
    anioActual = parseInt(document.getElementById('anioFilter').value);
    actualizarCalendario();
    actualizarEstadisticas();
    actualizarURL();
}

function mesAnterior() {
    if (mesActual === 0) {
        mesActual = 11;
        anioActual--;
    } else {
        mesActual--;
    }
    document.getElementById('mesFilter').value = mesActual;
    document.getElementById('anioFilter').value = anioActual;
    actualizarCalendario();
    actualizarEstadisticas();
    actualizarURL();
}

function mesSiguiente() {
    if (mesActual === 11) {
        mesActual = 0;
        anioActual++;
    } else {
        mesActual++;
    }
    document.getElementById('mesFilter').value = mesActual;
    document.getElementById('anioFilter').value = anioActual;
    actualizarCalendario();
    actualizarEstadisticas();
    actualizarURL();
}

function irAHoy() {
    const hoy = new Date();
    mesActual = hoy.getMonth();
    anioActual = hoy.getFullYear();
    document.getElementById('mesFilter').value = mesActual;
    document.getElementById('anioFilter').value = anioActual;
    actualizarCalendario();
    actualizarEstadisticas();
    actualizarURL();
}

function actualizarURL() {
    const url = new URL(window.location);
    url.searchParams.set('mes', mesActual);
    url.searchParams.set('anio', anioActual);
    if (vehiculoFiltro) {
        url.searchParams.set('vehiculo', vehiculoFiltro);
    }
    window.history.pushState({}, '', url);
}

function actualizarCalendario() {
    const grid = document.querySelector('.calendar-grid');
    const dias = grid.querySelectorAll('.day-cell');
    dias.forEach(dia => dia.remove());

    const primerDia = new Date(anioActual, mesActual, 1);
    const ultimoDia = new Date(anioActual, mesActual + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const diaSemanaInicio = primerDia.getDay();

    // Actualizar encabezado
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    document.getElementById('mesAnioActual').textContent = `${meses[mesActual]} ${anioActual}`;

    // Días del mes anterior
    const ultimoDiaMesAnterior = new Date(anioActual, mesActual, 0).getDate();
    for (let i = diaSemanaInicio - 1; i >= 0; i--) {
        crearCeldaDia(ultimoDiaMesAnterior - i, true);
    }

    // Días del mes actual
    for (let dia = 1; dia <= diasEnMes; dia++) {
        crearCeldaDia(dia, false);
    }

    // Días del mes siguiente
    const celdasRestantes = 42 - (diaSemanaInicio + diasEnMes);
    for (let dia = 1; dia <= celdasRestantes; dia++) {
        crearCeldaDia(dia, true);
    }
}

function crearCeldaDia(numeroDia, otroMes) {
    const celda = document.createElement('div');
    celda.className = `day-cell ${otroMes ? 'other-month' : ''}`;
    
    const numero = document.createElement('div');
    numero.className = 'day-number';
    numero.textContent = numeroDia;
    celda.appendChild(numero);

    if (!otroMes) {
        const fechaCompleta = `${anioActual}-${String(mesActual + 1).padStart(2, '0')}-${String(numeroDia).padStart(2, '0')}`;
        const serviciosDelDia = obtenerServiciosDelDia(fechaCompleta);
        
        serviciosDelDia.forEach(servicio => {
            const item = crearItemServicio(servicio);
            celda.appendChild(item);
        });
    }

    document.querySelector('.calendar-grid').appendChild(celda);
}

function obtenerServiciosDelDia(fecha) {
    // Ajuste de fecha: suma 1 día para compensar la zona horaria
    const fechaAjustada = new Date(fecha);
    fechaAjustada.setDate(fechaAjustada.getDate() - 1);
    const fechaComparar = fechaAjustada.toISOString().split('T')[0];
    
    return servicios.filter(servicio => {
        if (vehiculoFiltro && servicio.vehiculos?.placa !== vehiculoFiltro) {
            return false;
        }
        // Comparación directa con fecha ajustada
        return servicio.fecha_servicio === fechaComparar;
    });
}

function crearItemServicio(servicio) {
    const item = document.createElement('div');
    item.className = `service-item ${servicio.estado}`;
    
    item.innerHTML = `
        <div class="service-vehicle">${servicio.vehiculos?.placa || 'Sin vehículo'}</div>
        <div class="service-type">${servicio.tipo_servicio}</div>
        <div class="service-cost">$${(servicio.costo || 0).toLocaleString()}</div>
    `;
    
    // Asignar el evento correctamente
    item.addEventListener('click', () => {
        window.location.href = `/viajes/editar/${servicio.id}`;
    });
    
    return item;
}

function actualizarEstadisticas() {
    const serviciosFiltrados = servicios.filter(servicio => {
        if (vehiculoFiltro && servicio.vehicle.placa !== vehiculoFiltro) {
            return false;
        }
        return true;
    });

    const serviciosMes = serviciosFiltrados.filter(servicio => {
        const fechaServicio = new Date(servicio.fecha_servicio);
        return fechaServicio.getMonth() === mesActual && fechaServicio.getFullYear() === anioActual;
    });

    const costoTotal = serviciosMes.reduce((total, servicio) => total + servicio.costo, 0);
    const vehiculosUnicos = new Set(serviciosFiltrados.map(s => s.vehiculos.placa));

    const totalElement = document.getElementById('totalServicios');
    const mesElement = document.getElementById('serviciosMes');
    const costoElement = document.getElementById('costoTotal');
    const vehiculosElement = document.getElementById('vehiculosActivos');

    if (totalElement) totalElement.textContent = serviciosFiltrados.length;
    if (mesElement) mesElement.textContent = serviciosMes.length;
    if (costoElement) costoElement.textContent = `$${costoTotal.toLocaleString()}`;
    if (vehiculosElement) vehiculosElement.textContent = vehiculosUnicos.size;
}

// Función para manejar cambios de filtros desde el servidor
function actualizarFiltros(nuevosServicios, nuevoMes, nuevoAnio, nuevoVehiculo) {
    servicios = nuevosServicios;
    mesActual = nuevoMes;
    anioActual = nuevoAnio;
    vehiculoFiltro = nuevoVehiculo || "";
    
    // Actualizar controles
    document.getElementById('mesFilter').value = mesActual;
    document.getElementById('anioFilter').value = anioActual;
    document.getElementById('vehiculoFilter').value = vehiculoFiltro;
    
    // Actualizar vista
    actualizarCalendario();
    actualizarEstadisticas();

}