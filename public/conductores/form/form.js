// form.js - JavaScript para el formulario de conductores

// Variables globales
let isEditing = false;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    initializeForm();
    setupEventListeners();
    setupValidation();
    hideLoadingOverlay(); // Asegurarse que esté oculto al inicio
});

// Inicializar formulario
function initializeForm() {
    const form = document.getElementById('conductorForm');
    isEditing = document.querySelector('input[name="id"]') !== null;

    // Fecha de nacimiento mínima/máxima (opcional)
    const fechaNacimientoInput = document.getElementById('fechaNacimiento');
    if (fechaNacimientoInput) {
        fechaNacimientoInput.max = new Date().toISOString().split('T')[0];
    }

    // Formateo para DUI
    const duiInput = document.getElementById('dui');
    if (duiInput) {
        duiInput.addEventListener('input', () => {
            duiInput.value = formatDUI(duiInput.value);
        });
    }

    // Campo de teléfono
    const telefonoInput = document.getElementById('telefono');
    if (telefonoInput) {
        telefonoInput.addEventListener('input', () => {
            telefonoInput.value = formatPhone(telefonoInput.value);
        });
    }
}

// Configurar eventos
function setupEventListeners() {
    const form = document.getElementById('conductorForm');
    const modal = document.getElementById('confirmModal');
    const closeModal = document.querySelector('.modal-close');
    const cancelConfirm = document.getElementById('cancelConfirm');
    const confirmSubmit = document.getElementById('confirmSubmit');
    const goBackToList = document.getElementById('goBackToList');

    // Evento de envío
    form.addEventListener('submit', handleFormSubmit);

    // Modal
    closeModal?.addEventListener('click', closeConfirmModal);
    cancelConfirm?.addEventListener('click', closeConfirmModal);
    confirmSubmit?.addEventListener('click', confirmFormSubmit);
    goBackToList?.addEventListener('click', goBack);

    // Cierre modal al hacer clic fuera
    modal?.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeConfirmModal();
        }
    });
}

// Validación simple
function setupValidation() {
    const requiredFields = document.querySelectorAll('#conductorForm [required]');
    requiredFields.forEach(field => {
        field.addEventListener('input', () => {
            if (field.validity.valid) {
                field.parentElement.classList.remove('error');
                field.parentElement.classList.add('success');
            } else {
                field.parentElement.classList.remove('success');
                field.parentElement.classList.add('error');
            }
        });
    });
}

// Enviar formulario
function handleFormSubmit(event) {
    event.preventDefault();
    document.getElementById('confirmModal').style.display = 'block';
}

// Confirmar envío
function confirmFormSubmit() {
    // Mostrar overlay al confirmar
    showLoadingOverlay();

    // Enviar formulario
    document.getElementById('conductorForm').submit();
}

// Mostrar overlay de carga
function showLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
    }
}

// Ocultar overlay de carga
function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// Cerrar modal
function closeConfirmModal() {
    document.getElementById('confirmModal').style.display = 'none';
}

// Volver al listado
function goBack() {
    window.location.href = '/conductores';
}

// Formato DUI: 12345678-9
function formatDUI(value) {
    return value
        .replace(/\D/g, '')
        .replace(/^(\d{8})(\d{1})$/, '$1-$2')
        .substring(0, 10);
}

// Formato teléfono: 1234-5678
function formatPhone(value) {
    return value
        .replace(/\D/g, '')
        .replace(/^(\d{4})(\d{1,4})$/, '$1-$2')
        .substring(0, 9);
}

