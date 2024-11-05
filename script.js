// script.js

// Función para agregar una compra
function agregarCompra() {
    const nombreCompra = document.getElementById("nombreCompra").value;
    const banco = document.getElementById("banco").value;

    if (nombreCompra) {
        const compra = {
            nombre: nombreCompra,
            banco: banco,
            fecha: new Date(),
            recordatorios: banco === 'bnb' ? calcularRecordatoriosBNB() : calcularRecordatoriosBCP()
        };

        guardarCompraLocal(compra);
        mostrarCompras();
        document.getElementById("nombreCompra").value = ""; // Limpiar input
    }
}

// Función para calcular recordatorios BNB (cada intervalo mensual)
function calcularRecordatoriosBNB() {
    const intervalos = [1, 7, 14, 28];
    const recordatorios = [];
    const ahora = new Date();

    intervalos.forEach(dia => {
        const fecha = new Date(ahora.getFullYear(), ahora.getMonth(), dia);
        recordatorios.push(fecha);
    });

    return recordatorios;
}

// Función para calcular recordatorios BCP (cada 7 días desde la fecha de compra)
function calcularRecordatoriosBCP() {
    const ahora = new Date();
    const recordatorios = [];
    for (let i = 1; i <= 4; i++) {
        const fecha = new Date(ahora);
        fecha.setDate(ahora.getDate() + i * 7);
        recordatorios.push(fecha);
    }
    return recordatorios;
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
            <p>Banco: ${compra.banco.toUpperCase()}</p>
            <p>Fecha de Compra: ${new Date(compra.fecha).toLocaleString()}</p>
            <p>Próximos Recordatorios:</p>
            <ul>
                ${compra.recordatorios.map(fecha => `<li>${new Date(fecha).toLocaleString()}</li>`).join("")}
            </ul>
        `;
        comprasList.appendChild(compraDiv);
    });
}

// Función para activar notificaciones (requiere permiso del usuario)
function activarNotificaciones() {
    if ('Notification' in window && navigator.serviceWorker) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                alert('Notificaciones activadas.');
            } else {
                alert('No se activaron las notificaciones.');
            }
        });
    } else {
        alert('Este navegador no soporta notificaciones.');
    }
}

// Mostrar compras al cargar la página
document.addEventListener("DOMContentLoaded", mostrarCompras);
