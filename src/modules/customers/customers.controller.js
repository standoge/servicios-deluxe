
// Simulación de base de datos en memoria
let clientesDB = [
    { id: 1, nombre: "Ana", apellido: "Martínez", correo: "ana@example.com", telefono: "1234-5678", estado: "activo" },
    { id: 2, nombre: "Carlos", apellido: "López", correo: "carlos@example.com", telefono: "8765-4321", estado: "inactivo" }
];


// Mostrar listado de clientes
export function mostrarListadoClientes(req, res) {
    const estadisticas = {
        totalClientes: clientesDB.length,
        activos: clientesDB.filter(c => c.estado === 'activo').length,
        inactivos: clientesDB.filter(c => c.estado === 'inactivo').length
    };

    res.render('customers/list', {
        clientes: clientesDB,
        estadisticas,
        clientesJSON: JSON.stringify(clientesDB)
    });
}

// Mostrar formulario vacío
export function renderCustomerForm(req, res) {
    res.render('customers/form', {
        titulo: 'Registrar Cliente',
        accion: '/clientes/nuevo',
        cliente: {}
    });
}

// Guardar nuevo cliente
export function createCustomer(req, res) {
    const { nombre, apellido, correo, telefono, estado } = req.body;

    const nuevoCliente = {
        id: clientesDB.length + 1,
        nombre,
        apellido,
        correo,
        telefono,
        estado
    };

    clientesDB.push(nuevoCliente);
    res.redirect('/clientes');
}

// Mostrar formulario con datos para edición
export function getCustomerById(req, res) {
    const cliente = clientesDB.find(c => c.id === parseInt(req.params.id));

    if (!cliente) {
        return res.status(404).send('Cliente no encontrado');
    }

    res.render('customers/form', {
        titulo: 'Editar Cliente',
        accion: `/clientes/editar/${cliente.id}`,
        cliente
    });
}

// Actualizar cliente
export function updateCustomer(req, res) {
    const cliente = clientesDB.find(c => c.id === parseInt(req.params.id));

    if (!cliente) {
        return res.status(404).send('Cliente no encontrado');
    }

    const { nombre, apellido, correo, telefono, estado } = req.body;

    cliente.nombre = nombre;
    cliente.apellido = apellido;
    cliente.correo = correo;
    cliente.telefono = telefono;
    cliente.estado = estado;

    res.redirect('/clientes/list');
}

