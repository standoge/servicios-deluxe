console.log("🧑‍✈️ Listado de conductores cargado");
document.querySelectorAll('.btn-delete-driver').forEach(btn => {
        btn.addEventListener('click', function() {
            const driver_id = this.getAttribute('data-id');
            if (confirm("¿Seguro que deseas desactivar este conductor?")) {
                fetch(`/conductores/${driver_id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                })
                .then(response => response.json())
                .then(data => {
                    if(data.success) {
                        alert(data.message);
                    } else {
                        alert("Error: " + data.message);
                    }
                })
                .catch(error => {
                    alert("Error de red: " + error);
                });
            }
        });
    });