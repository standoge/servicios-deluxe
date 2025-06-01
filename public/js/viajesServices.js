document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('servicioForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(form).entries());
        if (data.costo) data.costo = parseFloat(data.costo);
        if (data.vehicle_id) data.vehicle_id = parseInt(data.vehicle_id);

        const isEdit = !!data.id;
        const url = isEdit ? `/viajes/${data.id}` : '/viajes/';
        const method = 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                alert('¡Servicio guardado exitosamente!');
            } else {
                const err = await res.text();
                alert('Error: ' + err);
            }
        } catch (err) {
            alert('Error de red');
        }
    });
});