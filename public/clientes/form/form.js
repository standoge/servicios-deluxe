document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('clienteForm');
    const confirmModal = document.getElementById('confirmModal');
    const confirmSubmit = document.getElementById('confirmSubmit');
    const cancelConfirm = document.getElementById('cancelConfirm');
    const closeModal = document.querySelector('.modal-close');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Interceptar el envío del formulario para mostrar el modal de confirmación
    form.addEventListener('submit', function (e) {
        e.preventDefault(); // Detener envío del formulario tradicional
        confirmModal.style.display = 'block';
    });

    // Confirmar envío y usar Fetch para enviar la petición
    confirmSubmit.addEventListener('click', function () {
        confirmModal.style.display = 'none';
        loadingOverlay.style.display = 'flex'; // Mostrar spinner de carga

        // Recopilar datos del formulario en formato JSON
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        fetch(form.action, {
            method: form.method, // Asegúrate que el atributo method del formulario sea el correcto (e.g., "POST")
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(json => {
            loadingOverlay.style.display = 'none';
            if(json.success) {
                alert(json.message);
                // Opcional: limpiar formulario o actualizar la vista
            } else {
                alert("Error: " + json.message);
            }
        })
        .catch(err => {
            loadingOverlay.style.display = 'none';
            alert("Error de red: " + err);
        });
    });

    // Cancelar confirmación
    cancelConfirm.addEventListener('click', function () {
        confirmModal.style.display = 'none';
    });

    // Cerrar modal con la X
    if (closeModal) {
        closeModal.addEventListener('click', function () {
            confirmModal.style.display = 'none';
        });
    }

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', function (event) {
        if (event.target === confirmModal) {
            confirmModal.style.display = 'none';
        }
    });
});
