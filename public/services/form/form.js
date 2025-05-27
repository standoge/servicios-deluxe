// form.js - JavaScript para el formulario de servicios

// Variables globales
let formData = {};
let isEditing = false;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    setupEventListeners();
    setupValidation();
});

// Inicializar formulario
function initializeForm() {
    const form = document.getElementById('servicioForm');
    const submitBtn = document.getElementById('submitBtn');
    
    // Determinar si estamos editando
    isEditing = document.querySelector('input[name="id"]') !== null;
    
    // Configurar fecha mínima (hoy)
    const fechaInput = document.getElementById('fechaServicio');
    const today = new Date().toISOString().split('T')[0];
    fechaInput.min = today;
    
    // Si no hay fecha seleccionada, usar hoy
    if (!fechaInput.value) {
        fechaInput.value = today;
    }
    
    // Configurar hora por defecto si no existe
    const horaInput = document.getElementById('horaServicio');
    if (!horaInput.value) {
        const now = new Date();
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        horaInput.value = `${hour}:${minute}`;
    }
    
    // Formatear campo de costo
    setupCostoField();
    
    // Auto-completar placa
    setupPlacaField();
}

// Configurar event listeners
function setupEventListeners() {
    const form = document.getElementById('servicioForm');
    const modal = document.getElementById('confirmModal');
    const closeModal = document.querySelector('.modal-close');
    const cancelConfirm = document.getElementById('cancelConfirm');
    const confirmSubmit = document.getElementById('confirmSubmit');
    const goBackToList = document.getElementById('goBackToList');
    
    // Evento de envío del formulario
    form.addEventListener('submit', handleFormSubmit);
    
    // Modal events
    closeModal.addEventListener('click', closeConfirmModal);
    cancelConfirm.addEventListener('click', closeConfirmModal);
    confirmSubmit.addEventListener('click', confirmFormSubmit);
    goBackToList.addEventListener('click', goBack);
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeConfirmModal();
        }
    });
    
    // Tecla Escape para cerrar modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeConfirmModal();
        }
    });
    
    // Auto-save en localStorage (opcional)
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
    document.getElementById('servicioForm').submit();
    // Limpiar localStorage después de enviar el formulario
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
    const form = document.getElementById('servicioForm');
    const inputs = form.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
        input.addEventListener('change', () => {
            const key = input.name;
            const value = input.value;
            localStorage.setItem(`servicioForm_${key}`, value);
        });

        // Rellenar si hay datos guardados
        const savedValue = localStorage.getItem(`servicioForm_${input.name}`);
        if (savedValue) input.value = savedValue;
    });
}

function goBack() {
    // Limpiar localStorage al cancelar o salir del formulario
    clearLocalStorageForForm(); 
    window.location.href = '../../servicios/list';
}

function clearLocalStorageForForm() {
    const form = document.getElementById('servicioForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        localStorage.removeItem(`servicioForm_${input.name}`);
    });
}
