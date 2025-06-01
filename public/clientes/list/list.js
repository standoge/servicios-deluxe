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

    // Filtro por estado
    document.getElementById('estadoFilter').addEventListener('change', function () {
        const filterValue = this.value.toLowerCase();
        const table = document.getElementById('clientesTable');
        const trs = table.tBodies[0].rows;

        for (let row of trs) {
            const estado = row.cells[4].textContent.toLowerCase();
            if (filterValue === '' || estado === filterValue) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    });

    // Exponer funciones globales para HTML inline
    window.sortTable = sortTable;
    window.verCliente = verCliente;
});
