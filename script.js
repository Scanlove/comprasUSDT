// script.js

// Verifica si es un nuevo mes y elimina registros si es necesario
function verificarMes() {
    const mesActual = new Date().getMonth();
    const mesGuardado = localStorage.getItem("mes");

    if (mesGuardado === null || parseInt(mesGuardado) !== mesActual) {
        // Nuevo mes detectado, borrar registros
        localStorage.setItem("mes", mesActual); // Guardar el mes actual
        localStorage.removeItem("compras");     // Eliminar registros de compras
        compras = [];                           // Reiniciar la lista de compras
    }
}

let compras = JSON.parse(localStorage.getItem("compras")) || [];
verificarMes();  // Llamada para verificar el mes al cargar la página

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

// Función para calcular recordatorios BNB en los intervalos 1-7, 15-21, y 22-28 del mes
function calcularRecordatoriosBNB() {
    const ahora = new Date();
    const recordatorios = [];
    
    // Primer recordatorio: del 1 al 7
    let primerRecordatorio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    recordatorios.push(primerRecordatorio);
    
    // Segundo recordatorio: del 15 al 21
    let segundoRecordatorio = new Date(ahora.getFullYear(), ahora.getMonth(), 15);
    recordatorios.push(segundoRecordatorio);
    
    // Tercer recordatorio: del 22 al 28
    let tercerRecordatorio = new Date(ahora.getFullYear(), ahora.getMonth(), 22);
    recordatorios.push(tercerRecordatorio);

    return recordatorios;
}

// Función para calcular recordatorios BCP (cada 7 días desde la fecha de compra)
function calcularRecordatoriosBCP() {
    const ahora = new Date();
    const recordatorios = [];
    for (let i = 1; i <= 4; i++) {  // Calcula 4 recordatorios cada 7 días
        const fecha = new Date(ahora);
        fecha.setDate(ahora.getDate() + i * 7);
        recordatorios.push(fecha);
    }
    return recordatorios;
}

// Función para mostrar compras guardadas en formato de dos columnas
function mostrarCompras() {
    const bnbColumn = document.querySelector("#compras-list .column:nth-child(1)");
    const bcpColumn = document.querySelector("#compras-list .column:nth-child(2)");
    bnbColumn.innerHTML = '<div class="column-title">BNB</div>';
    bcpColumn.innerHTML = '<div class="column-title">BCP</div>';

    compras.forEach((compra, index) => {
        const compraDiv = document.createElement("div");
        compraDiv.classList.add("compra-item");

        // Obtener la fecha y hora en formato legible
        const fechaCompra = new Date(compra.fecha).toLocaleString();

        compraDiv.innerHTML = `
            <strong>${compra.nombre}</strong>
            <p>Fecha y Hora: ${fechaCompra}</p>
            <button onclick="activarNotificacionIndividual(${index})">Activar Notificación</button>
        `;

        if (compra.banco === "bnb") {
            bnbColumn.appendChild(compraDiv);
        } else if (compra.banco === "bcp") {
            bcpColumn.appendChild(compraDiv);
        }
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
