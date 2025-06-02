// form.js - JavaScript para el formulario de servicios

// Variables globales
let formData = {};
let isEditing = false;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    setupEventListeners();
    setupValidation();
    setupClienteFields();
});

// Inicializar formulario
function initializeForm() {
    const form = document.getElementById('viajeForm');
    isEditing = document.querySelector('input[name="id"]') !== null;

    // Configurar fechas mínimas (hoy)
    const fechaSalidaInput = document.getElementById('fecha_salida');
    const fechaRegresoInput = document.getElementById('fecha_regreso');
    const now = new Date();
    const today = now.toISOString().slice(0, 16);
    
    fechaSalidaInput.min = today;
    
    // Si no hay fecha seleccionada, usar ahora + 1 hora
    if (!fechaSalidaInput.value) {
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
        fechaSalidaInput.value = oneHourLater.toISOString().slice(0, 16);
    }

    // Configurar evento para fecha de regreso
    fechaSalidaInput.addEventListener('change', function() {
        fechaRegresoInput.min = this.value;
    });

    // Formatear campo de costo
    setupCostoField();
}

// Configurar campos de cliente
function setupClienteFields() {
    const clienteSelect = document.getElementById('cliente_id');
    const nuevoClienteFields = document.getElementById('nuevoClienteFields');

    clienteSelect.addEventListener('change', function() {
        if (this.value === 'nuevo') {
            nuevoClienteFields.style.display = 'block';
            // Marcar campos como requeridos
            document.querySelectorAll('#nuevoClienteFields input').forEach(input => {
                input.required = true;
            });
        } else {
            nuevoClienteFields.style.display = 'none';
            // Quitar requerido de campos de nuevo cliente
            document.querySelectorAll('#nuevoClienteFields input').forEach(input => {
                input.required = false;
            });
        }
    });

    // Disparar el evento al cargar si ya está seleccionado "nuevo"
    if (clienteSelect.value === 'nuevo') {
        clienteSelect.dispatchEvent(new Event('change'));
    }
}

// Configurar event listeners
function setupEventListeners() {
    const form = document.getElementById('viajeForm');
    const modal = document.getElementById('confirmModal');
    const closeModal = document.querySelector('.modal-close');
    const cancelConfirm = document.getElementById('cancelConfirm');
    const confirmSubmit = document.getElementById('confirmSubmit');
    const goBackToList = document.getElementById('goBackToList');
    
    form.addEventListener('submit', handleFormSubmit);
    
    closeModal.addEventListener('click', closeConfirmModal);
    cancelConfirm.addEventListener('click', closeConfirmModal);
    confirmSubmit.addEventListener('click', confirmFormSubmit);
    goBackToList.addEventListener('click', goBack);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeConfirmModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeConfirmModal();
        }
    });
    
    setupAutoSave();
}

// Configurar validación en tiempo real
function setupValidation() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

// Validar un campo individual
function validateField(e) {
    const field = e.target;
    if (!field.checkValidity()) {
        field.classList.add('invalid');
        field.setCustomValidity("Este campo es requerido o tiene un formato incorrecto.");
    } else {
        field.classList.remove('invalid');
        field.setCustomValidity("");
    }
}

// Limpiar error visual cuando el usuario edita
function clearFieldError(e) {
    e.target.classList.remove('invalid');
    e.target.setCustomValidity("");
}

// Mostrar modal de confirmación al enviar
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validar campos de nuevo cliente si es necesario
    if (document.getElementById('cliente_id').value === 'nuevo') {
        const nuevoClienteFields = document.querySelectorAll('#nuevoClienteFields input');
        let isValid = true;
        
        nuevoClienteFields.forEach(field => {
            if (!field.checkValidity()) {
                field.classList.add('invalid');
                isValid = false;
            }
        });
        
        if (!isValid) {
            return;
        }
    }
    
    const modal = document.getElementById('confirmModal');
    modal.style.display = 'block';
}

// Cerrar modal
function closeConfirmModal() {
    const modal = document.getElementById('confirmModal');
    modal.style.display = 'none';
}

// Enviar el formulario después de confirmar
function confirmFormSubmit() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.display = 'flex';
    document.getElementById('viajeForm').submit();
    clearLocalStorageForForm(); 
}

// Formateo en el campo de costo
function setupCostoField() {
    const costoInput = document.getElementById('costo');
    costoInput.addEventListener('input', () => {
        let value = costoInput.value;

        // Permitir solo números y un punto decimal
        value = value.replace(/[^0-9.]/g, '');

        // Evitar más de un punto
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts[1];
        }

        // Limitar a dos decimales
        if (parts[1]?.length > 2) {
            parts[1] = parts[1].slice(0, 2);
            value = parts[0] + '.' + parts[1];
        }

        costoInput.value = value;
    });
}

// Autoformato para el campo placa (opcional)
function setupPlacaField() {
    const placaInput = document.getElementById('vehiculo.placa');
    placaInput.addEventListener('input', () => {
        placaInput.value = placaInput.value.toUpperCase().replace(/[^A-Z0-9\-]/g, '');
    });
}

// Auto-guardado (opcional, solo si lo implementas)
function setupAutoSave() {
    const form = document.getElementById('viajeForm');
    const inputs = form.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
        input.addEventListener('change', () => {
            const key = input.name;
            const value = input.value;
            localStorage.setItem(`viajeForm_${key}`, value);
        });

        // Rellenar si hay datos guardados
        const savedValue = localStorage.getItem(`viajeForm_${input.name}`);
        if (savedValue) input.value = savedValue;
    });
}

function goBack() {
    clearLocalStorageForForm(); 
    window.location.href = '/viajes/list';
}

function clearLocalStorageForForm() {
    const form = document.getElementById('viajeForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        localStorage.removeItem(`viajeForm_${input.name}`);
    });
}