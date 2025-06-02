// Variables globales
let viajes = [];
let mesActual = new Date().getMonth();
let anioActual = new Date().getFullYear();
let vehiculoFiltro = "";

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    cargarDatosDelServidor();
    
    // Event listeners
    document.getElementById('vehiculoFilter').addEventListener('change', filtrarViajes);
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
            viajes = JSON.parse(scriptElement.textContent);
        }
        
        actualizarCalendario();
        actualizarEstadisticas();
    } catch (error) {
        console.error('Error al cargar datos del servidor:', error);
    }
}

function editarServicio(id) {
    window.location.href = `/servicios/form/${id}`;
}

function filtrarViajes() {
    vehiculoFiltro = document.getElementById('vehiculoFilter').value;
    actualizarCalendario();
    actualizarEstadisticas();
    
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
    // Limpiar solo los días, no los encabezados
    const dias = Array.from(grid.querySelectorAll('.day-cell'));
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
    const grid = document.querySelector('.calendar-grid');
    const celda = document.createElement('div');
    celda.className = `day-cell ${otroMes ? 'other-month' : ''}`;
    
    const numero = document.createElement('div');
    numero.className = 'day-number';
    numero.textContent = numeroDia;
    celda.appendChild(numero);

    if (!otroMes) {
        const fechaCompleta = `${anioActual}-${String(mesActual + 1).padStart(2, '0')}-${String(numeroDia).padStart(2, '0')}`;
        const viajesDelDia = obtenerViajesDelDia(fechaCompleta);
        
        viajesDelDia.forEach(viaje => {
            const item = crearItemViaje(viaje);
            celda.appendChild(item);
        });
    }

    grid.appendChild(celda);
}

function obtenerViajesDelDia(fecha) {
    return viajes.filter(viaje => {
        if (vehiculoFiltro && viaje.vehiculos?.placa !== vehiculoFiltro) {
            return false;
        }
        return viaje.fecha_servicio === fecha;
    });
}

function crearItemViaje(viaje) {
    const item = document.createElement('div');
    item.className = `service-item ${viaje.estado || 'programado'}`;
    item.onclick = () => editarServicio(viaje.id);
    
    item.innerHTML = `
        <div class="service-vehicle">${viaje.vehiculos?.placa || 'Sin vehículo'}</div>
        <div class="service-type">${viaje.tipo_servicio || 'Viaje'}</div>
        <div class="service-cost">$${(viaje.costo || 0).toLocaleString()}</div>
    `;
    
    return item;
}

function actualizarEstadisticas() {
    const viajesFiltrados = viajes.filter(viaje => {
        if (vehiculoFiltro && viaje.vehiculos?.placa !== vehiculoFiltro) {
            return false;
        }
        return true;
    });

    const viajesMes = viajesFiltrados.filter(viaje => {
        const fechaViaje = new Date(viaje.fecha_servicio);
        return fechaViaje.getMonth() === mesActual && fechaViaje.getFullYear() === anioActual;
    });

    const costoTotal = viajesMes.reduce((total, viaje) => total + (viaje.costo || 0), 0);
    const vehiculosUnicos = new Set(viajesFiltrados.map(v => v.vehiculos?.placa).filter(Boolean));

    const totalElement = document.getElementById('totalServicios');
    const mesElement = document.getElementById('serviciosMes');
    const costoElement = document.getElementById('costoTotal');
    const vehiculosElement = document.getElementById('vehiculosActivos');

    if (totalElement) totalElement.textContent = viajesFiltrados.length;
    if (mesElement) mesElement.textContent = viajesMes.length;
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