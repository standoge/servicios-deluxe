document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('clienteForm');
	const confirmModal = document.getElementById('confirmModal');
	const confirmSubmit = document.getElementById('confirmSubmit');
	const cancelConfirm = document.getElementById('cancelConfirm');
	const closeModal = document.querySelector('.modal-close');
	const loadingOverlay = document.getElementById('loadingOverlay');

	let formSubmitted = false;

	// Interceptar el envío del formulario para mostrar el modal
	form.addEventListener('submit', function (e) {
		if (!formSubmitted) {
			e.preventDefault(); // Detiene el envío del formulario
			confirmModal.style.display = 'block';
		}
	});

	// Confirmar envío del formulario
	confirmSubmit.addEventListener('click', function () {
		confirmModal.style.display = 'none';
		loadingOverlay.style.display = 'flex'; // Mostrar spinner de carga
		formSubmitted = true;
		form.submit(); // Enviar formulario
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
