export function mostrarListadoConductores(req, res) {
	const conductores = [
		{ id: 1, nombre: "Carlos", apellido: "Gómez", dui: "12345678-9", licencia: "A123456", estado: "activo" },
		{ id: 2, nombre: "Luis", apellido: "Pérez", dui: "98765432-1", licencia: "B987654", estado: "inactivo" }
	];

	const estadisticas = {
		totalConductores: conductores.length,
		activos: conductores.filter(c => c.estado === 'activo').length,
		inactivos: conductores.filter(c => c.estado === 'inactivo').length
	};

	res.render('drivers/list', {
		conductores,
		estadisticas,
		conductoresJSON: JSON.stringify(conductores)
	});
}

//bloque de formulario de conductores

let conductoresDB = [
	{ id: 1, nombre: "Carlos", apellido: "Gómez", dui: "12345678-9", licencia: "A123456", tipoLicencia: "Liviana", telefono: "2222-2222", fechaContratacion: "2023-01-15", estado: "activo", observaciones: "" },
	{ id: 2, nombre: "Luis", apellido: "Pérez", dui: "98765432-1", licencia: "B987654", tipoLicencia: "Pesada", telefono: "7777-7777", fechaContratacion: "2022-10-10", estado: "inactivo", observaciones: "En licencia médica" }
];

// Mostrar formulario vacío
export function renderDriverForm(req, res) {
	res.render('drivers/form', {
		titulo: 'Registrar Conductor',
		accion: '/conductores/nuevo',
		conductor: {}
	});
}

// Guardar nuevo conductor
export function createDriver(req, res) {
	const { nombre, apellido, dui, licencia, tipoLicencia, telefono, fechaContratacion, estado, observaciones } = req.body;

	const nuevoConductor = {
		id: conductoresDB.length + 1,
		nombre,
		apellido,
		dui,
		licencia,
		tipoLicencia,
		telefono,
		fechaContratacion,
		estado,
		observaciones
	};

	conductoresDB.push(nuevoConductor);
	res.redirect('/conductores/list');
}

// Mostrar formulario con datos
export function getDriverById(req, res) {
	const conductor = conductoresDB.find(c => c.id === parseInt(req.params.id));

	if (!conductor) {
		return res.status(404).send('Conductor no encontrado');
	}

	res.render('drivers/form', {
		titulo: 'Editar Conductor',
		accion: `/conductores/editar/${conductor.id}`,
		conductor
	});
}

// Actualizar datos del conductor
export function updateDriver(req, res) {
	const conductor = conductoresDB.find(c => c.id === parseInt(req.params.id));

	if (!conductor) {
		return res.status(404).send('Conductor no encontrado');
	}

	const { nombre, apellido, dui, licencia, tipoLicencia, telefono, fechaContratacion, estado, observaciones } = req.body;

	conductor.nombre = nombre;
	conductor.apellido = apellido;
	conductor.dui = dui;
	conductor.licencia = licencia;
	conductor.tipoLicencia = tipoLicencia;
	conductor.telefono = telefono;
	conductor.fechaContratacion = fechaContratacion;
	conductor.estado = estado;
	conductor.observaciones = observaciones;

	res.redirect('/conductores/list');
}

