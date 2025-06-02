// list.js - Lógica JS para listado de clientes

document.addEventListener('DOMContentLoaded', () => {
    // Función para ordenar la tabla por columna
    function sortTable(columnIndex) {
        const table = document.getElementById("clientesTable");
        let switching = true;
        let dir = "asc";
        let switchcount = 0;

        while (switching) {
            switching = false;
            let rows = table.rows;

            for (let i = 1; i < (rows.length - 1); i++) {
                let shouldSwitch = false;
                let x = rows[i].getElementsByTagName("TD")[columnIndex];
                let y = rows[i + 1].getElementsByTagName("TD")[columnIndex];
                let xContent = x.textContent.toLowerCase();
                let yContent = y.textContent.toLowerCase();

                if (dir === "asc") {
                    if (xContent > yContent) {
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir === "desc") {
                    if (xContent < yContent) {
                        shouldSwitch = true;
                        break;
                    }
                }
            }

            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                switchcount++;
            } else {
                if (switchcount === 0 && dir === "asc") {
                    dir = "desc";
                    switching = true;
                }
            }
        }
    }

    // Función para ver detalle del cliente
    function verCliente(id) {
        window.location.href = `/clientes/form/edit/${id}`;
    }



    document.querySelectorAll('.btn-delete-customer').forEach(btn => {
        btn.addEventListener('click', function() {
            const customerId = this.getAttribute('data-id');
            if (confirm("¿Seguro que deseas eliminar este cliente?")) {
                fetch(`/clientes/${customerId}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                })
                .then(response => response.json())
                .then(data => {
                    if(data.success) {
                        alert(data.message);
                        // Eliminar el elemento de la tabla o recargar la página
                        document.getElementById('row-' + customerId).remove();
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

    // Exponer funciones globales para HTML inline
    window.sortTable = sortTable;
    window.verCliente = verCliente;
});
