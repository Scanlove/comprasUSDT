// script.js

let compras = JSON.parse(localStorage.getItem("compras")) || [];

// Función para agregar una compra
function agregarCompra() {
    const nombreCompra = document.getElementById("nombreCompra").value;
    const banco = document.getElementById("banco").value;

    if (nombreCompra && banco) {
        const compra = {
            nombre: nombreCompra,
            banco: banco,
            fecha: new Date(),  // Guardamos la fecha actual de la compra
            recordatorios: banco === 'bnb' ? calcularRecordatoriosBNB() : calcularRecordatoriosBCP()
        };

        compras.push(compra);
        localStorage.setItem("compras", JSON.stringify(compras));
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

// Función para mostrar compras guardadas en formato horizontal
function mostrarCompras() {
    const comprasList = document.getElementById("compras-list");
    comprasList.innerHTML = "";

    compras.forEach((compra, index) => {
        const compraDiv = document.createElement("div");
        compraDiv.classList.add("compra-item");

        // Obtener la fecha y hora en formato legible
        const fechaCompra = new Date(compra.fecha).toLocaleString();

        compraDiv.innerHTML = `
            <strong>${compra.nombre}</strong>
            <p>Banco: ${compra.banco ? compra.banco.toUpperCase() : ''}</p>
            <p>Fecha y Hora: ${fechaCompra}</p>
            <button onclick="activarNotificacionIndividual(${index})">Activar Notificación</button>
        `;
        comprasList.appendChild(compraDiv);
    });
}

// Función para activar notificaciones para todas las compras
function activarNotificaciones() {
    if ('Notification' in window && navigator.serviceWorker) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                compras.forEach(compra => {
                    compra.recordatorios.forEach(fecha => {
                        programarNotificacion(compra.nombre, fecha);
                    });
                });
                alert('Notificaciones activadas para todas las compras.');
            } else {
                alert('No se activaron las notificaciones.');
            }
        });
    } else {
        alert('Este navegador no soporta notificaciones.');
    }
}

// Función para activar notificación individual para una compra
function activarNotificacionIndividual(index) {
    const compra = compras[index];
    compra.recordatorios.forEach(fecha => {
        programarNotificacion(compra.nombre, fecha);
    });
    alert(`Notificaciones activadas para ${compra.nombre}.`);
}

// Función para programar una notificación
function programarNotificacion(nombreCompra, fecha) {
    const tiempoRestante = fecha - new Date();
    if (tiempoRestante > 0) {
        setTimeout(() => {
            new Notification(`TOCA COMPRAR "${nombreCompra}"`);
        }, tiempoRestante);
    }
}

// Mostrar compras al cargar la página
document.addEventListener("DOMContentLoaded", mostrarCompras);
