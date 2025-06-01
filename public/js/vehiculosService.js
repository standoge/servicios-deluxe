document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('vehiculoForm');
    if (form) {
        form.addEventListener('submit', handleVehicleSubmit);
    }
});

async function handleVehicleSubmit(e) {
    e.preventDefault();
    console.log('Submit manejado por archivo externo.');
    const form = e.target;
    const data = Object.fromEntries(new FormData(form).entries());
    // Convierte seguro_vigente a booleano
    if (data.seguro_vigente !== undefined) {
        data.seguro_vigente = data.seguro_vigente === "true";
    }
    const isEdit = !!data.vehicle_id;
    const url = isEdit ? `/vehiculos/${data.vehicle_id}` : '/vehiculos/';
    const method = 'POST';

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const msgDiv = document.getElementById('form-message');
        if (res.ok) {
            msgDiv.innerHTML = `<span style="color:green;font-weight:bold;">¡Vehículo ${isEdit ? 'modificado' : 'agregado'} exitosamente!</span>`;
            setTimeout(() => {
                window.location.href = '/vehiculos/list';
            }, 1200);
        } else {
            const err = await res.text();
            msgDiv.innerHTML = `<span style="color:red;">Error: ${err}</span>`;
        }
    } catch (err) {
        document.getElementById('form-message').innerHTML = `<span style="color:red;">Error de red</span>`;
    }
}