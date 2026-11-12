
// ===== ELEMENTOS =====

const tiempoCronometro = document.getElementById("tiempoCronometro");
const estadoCronometro = document.getElementById("estadoCronometro");

const btnIniciar = document.getElementById("btnIniciar");
const btnPausar = document.getElementById("btnPausar");
const btnFinalizar = document.getElementById("btnFinalizar");

const tiempoAcumulado = document.getElementById("tiempoAcumulado");
const horasEstudio = document.getElementById("horasEstudio");


// ===== VARIABLES =====

let segundos = 0;
let intervalo = null;


// ===== TEMPORADA MENSUAL =====

const fechaCronometro = new Date();

const claveTiempo = "lifeOS_tiempo_estudio_" +
    fechaCronometro.getFullYear() + "_" +
    fechaCronometro.getMonth();

let tiempoMes = Number(localStorage.getItem(claveTiempo)) || 0;


// ===== MOSTRAR TIEMPO =====

function convertirTiempo(segundos) {

    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segundosRestantes = segundos % 60;

    return String(horas).padStart(2, "0") + ":" +
        String(minutos).padStart(2, "0") + ":" +
        String(segundosRestantes).padStart(2, "0");
}


// ===== ACTUALIZAR PANTALLA =====

function actualizarPantalla() {

    tiempoCronometro.textContent = convertirTiempo(segundos);

    const horas = Math.floor(tiempoMes / 3600);
    const minutos = Math.floor((tiempoMes % 3600) / 60);

    tiempoAcumulado.textContent = horas + " h " + minutos + " min";

    horasEstudio.textContent = horas + " h";
}


// ===== INICIAR Y CONTINUAR =====

btnIniciar.addEventListener("click", function() {

    if (intervalo !== null) return;

    estadoCronometro.textContent = "Entrenamiento en curso...";

    btnIniciar.disabled = true;
    btnPausar.disabled = false;
    btnFinalizar.disabled = false;

    btnIniciar.textContent = "▶ Iniciar";

    intervalo = setInterval(function() {

        segundos++;
        actualizarPantalla();

    }, 1000);

});


// ===== PAUSAR =====

btnPausar.addEventListener("click", function() {

    clearInterval(intervalo);
    intervalo = null;

    estadoCronometro.textContent = "Entrenamiento pausado";

    btnIniciar.textContent = "▶ Continuar";
    btnIniciar.disabled = false;

    btnPausar.disabled = true;

});


// ===== FINALIZAR =====

btnFinalizar.addEventListener("click", function() {

    clearInterval(intervalo);
    intervalo = null;

    tiempoMes += segundos;

    localStorage.setItem(claveTiempo, tiempoMes);

    segundos = 0;

    estadoCronometro.textContent = "Entrenamiento finalizado";

    btnIniciar.textContent = "▶ Iniciar";
    btnIniciar.disabled = false;

    btnPausar.disabled = true;
    btnFinalizar.disabled = true;

    actualizarPantalla();

});


// ===== CARGAR DATOS =====

actualizarPantalla();



