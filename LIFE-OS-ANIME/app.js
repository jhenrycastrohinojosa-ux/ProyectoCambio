
// ===== FRASES MOTIVACIONALES =====

const frases = [
    {
        texto: "Un guerrero no se rinde cuando cae, se levanta y vuelve a intentarlo.",
        autor: "FILOSOFIA DEL GUERRERO"
    },
    {
        texto: "El esfuerzo de hoy construye la fuerza de mañana.",
        autor: "CAMINO SAIYAJIN"
    },
    {
        texto: "Nunca abandones tus sueños, sigue avanzando.",
        autor: "CAMINO SHINOBI"
    },
    {
        texto: "La disciplina supera al talento cuando el talento no se esfuerza.",
        autor: "MENTALIDAD VEGETA"
    }
];


// ===== CAMBIAR FRASE =====

const btnFrase = document.getElementById("btnFrase");

if (btnFrase) {

    btnFrase.addEventListener("click", function() {

        const numero = Math.floor(Math.random() * frases.length);

        document.getElementById("fraseTexto").textContent =
            frases[numero].texto;

        document.getElementById("fraseAutor").textContent =
            frases[numero].autor;

    });

}


// ===== MOSTRAR FECHA =====

const fecha = new Date();

const elementoFecha = document.getElementById("fecha");

if (elementoFecha) {

    elementoFecha.textContent =
        fecha.toLocaleDateString("es-PE", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }).toUpperCase();

}


// ===== OBTENER XP GLOBAL =====

function obtenerXP() {

    const xpHabitos =
        Number(localStorage.getItem("lifeOS_xp_habitos")) || 0;

    const xpEstudios =
        Number(localStorage.getItem("lifeOS_xp_estudios")) || 0;

    const xpMisiones =
        Number(localStorage.getItem("lifeOS_xp_misiones")) || 0;

    const xpInicio =
        Number(localStorage.getItem("lifeOS_xp_misiones_inicio")) || 0;

    const experiencia = Math.max(
        0,
        xpHabitos + xpEstudios + xpMisiones + xpInicio
    );

    localStorage.setItem("lifeOS_xp_total", experiencia);

    return experiencia;

}


// ===== MISIONES DE INICIO =====

let misionesGuardadas = JSON.parse(
    localStorage.getItem("lifeOS_misiones_inicio_completadas")
) || [];

let misiones = misionesGuardadas.length;

const botones = document.querySelectorAll(".btn-mision");


// ===== ACTUALIZAR PROGRESO =====

function actualizarProgreso() {

    // Recuperar misiones actualizadas

    misionesGuardadas = JSON.parse(
        localStorage.getItem("lifeOS_misiones_inicio_completadas")
    ) || [];

    misiones = misionesGuardadas.length;

    let experiencia = obtenerXP();

    let nivel = Math.floor(experiencia / 100) + 1;

    let xpActual = experiencia % 100;


    // Mostrar XP

    const elementoXP = document.getElementById("experiencia");

    if (elementoXP) {
        elementoXP.textContent = experiencia + " XP";
    }


    // Mostrar nivel

    const elementoNivel = document.getElementById("nivelActual");

    if (elementoNivel) {
        elementoNivel.textContent = String(nivel).padStart(2, "0");
    }


    // Mostrar misiones completadas

    const elementoMisiones =
        document.getElementById("misionesCompletadas");

    if (elementoMisiones) {
        elementoMisiones.textContent = misiones;
    }


    // Mostrar progreso

    const textoXP = document.getElementById("textoXP");

    if (textoXP) {
        textoXP.textContent = xpActual + " / 100 XP";
    }

    const barraXP = document.getElementById("barraExperiencia");

    if (barraXP) {
        barraXP.style.width = xpActual + "%";
    }


    // ===== ACTUALIZAR RANGO =====

    let rango = "Guerrero principiante";

    if (nivel >= 5) {
        rango = "Guerrero avanzado";
    }

    if (nivel >= 10) {
        rango = "Super Saiyajin";
    }

    if (nivel >= 20) {
        rango = "Maestro Shinobi";
    }


    const elementoRango = document.getElementById("rangoActual");

    if (elementoRango) {
        elementoRango.textContent = rango;
    }


    // Actualizar encabezado

    const nivelEncabezado = document.querySelector(".nivel span");

    const rangoEncabezado = document.querySelector(".nivel strong");

    if (nivelEncabezado) {
        nivelEncabezado.textContent = "⚡ NIVEL " + nivel;
    }

    if (rangoEncabezado) {
        rangoEncabezado.textContent = rango;
    }

}


// ===== COMPLETAR MISIONES DE INICIO =====

botones.forEach(function(boton, indice) {

    // Recuperar progreso

    if (misionesGuardadas.includes(indice)) {

        boton.textContent = "¡Completada! ✓";
        boton.disabled = true;

    }

    boton.addEventListener("click", function() {

        if (boton.disabled) {
            return;
        }

        const puntos = Number(boton.dataset.xp);

        let xpInicio = Number(
            localStorage.getItem("lifeOS_xp_misiones_inicio")
        ) || 0;

        xpInicio += puntos;

        localStorage.setItem(
            "lifeOS_xp_misiones_inicio",
            xpInicio
        );


        // Guardar misión completada

        misionesGuardadas.push(indice);

        localStorage.setItem(
            "lifeOS_misiones_inicio_completadas",
            JSON.stringify(misionesGuardadas)
        );

        misiones = misionesGuardadas.length;

        boton.textContent = "¡Completada! ✓";
        boton.disabled = true;

        actualizarProgreso();

    });

});


// ===== ACTUALIZAR AL VOLVER A INICIO =====

window.addEventListener("storage", actualizarProgreso);

window.addEventListener("focus", actualizarProgreso);

window.addEventListener("pageshow", actualizarProgreso);


// ===== INICIAR SISTEMA =====

actualizarProgreso();




