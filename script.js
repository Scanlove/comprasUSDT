// script.js

// Función para agregar una compra
function agregarCompra() {
    const nombre = document.getElementById("nombre").value;
    if (nombre) {
        const compra = {
            nombre: nombre,
            fecha: new Date(),
            bnbRecordatorios: calcularRecordatoriosBNB(),
            bcpRecordatorio: calcularRecordatorioBCP()
        };

        guardarCompraLocal(compra);
        mostrarCompras();
        document.getElementById("nombre").value = ""; // Limpiar input
    }
}

// Función para calcular recordatorios BNB
function calcularRecordatoriosBNB() {
    let recordatorios = [];
    const ahora = new Date();
    for (let i = 0; i < 4; i++) {
        const fecha = new Date(ahora);
        fecha.setDate(1 + i * 7);
        recordatorios.push(fecha);
    }
    return recordatorios;
}

// Función para calcular el siguiente recordatorio BCP
function calcularRecordatorioBCP() {
    const ahora = new Date();
    const siguienteFecha = new Date(ahora);
    siguienteFecha.setDate(ahora.getDate() + 7);
    return siguienteFecha;
}

// Función para guardar en local storage
function guardarCompraLocal(compra) {
    let compras = JSON.parse(localStorage.getItem("compras")) || [];
    compras.push(compra);
    localStorage.setItem("compras", JSON.stringify(compras));
}

// Función para mostrar compras guardadas
function mostrarCompras() {
    const comprasList = document.getElementById("compras-list");
    comprasList.innerHTML = "";

    let compras = JSON.parse(localStorage.getItem("compras")) || [];
    compras.forEach(compra => {
        const compraDiv = document.createElement("div");
        compraDiv.innerHTML = `
            <h3>${compra.nombre}</h3>
            <p>Fecha de Compra: ${new Date(compra.fecha).toLocaleString()}</p>
            <p>Próximos Recordatorios BNB:</p>
            <ul>
                ${compra.bnbRecordatorios.map(fecha => `<li>${new Date(fecha).toLocaleString()}</li>`).join("")}
            </ul>
            <p>Próximo Recordatorio BCP: ${new Date(compra.bcpRecordatorio).toLocaleString()}</p>
        `;
        comprasList.appendChild(compraDiv);
    });
}

// Mostrar compras al cargar la página
document.addEventListener("DOMContentLoaded", mostrarCompras);
