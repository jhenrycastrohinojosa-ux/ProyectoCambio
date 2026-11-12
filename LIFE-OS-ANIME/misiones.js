
// ===== CONFIGURACION DE MISIONES =====

const misionesDiarias = [
    {
        nombre: "Entrenamiento de programación",
        descripcion: "Practica programación durante 30 minutos.",
        xp: 20
    },
    {
        nombre: "Entrenamiento SQL",
        descripcion: "Practica consultas y bases de datos.",
        xp: 20
    },
    {
        nombre: "Camino del conocimiento",
        descripcion: "Repasa un tema aprendido en SENATI.",
        xp: 10
    },
    {
        nombre: "Disciplina Saiyajin",
        descripcion: "Completa tus hábitos del día.",
        xp: 15
    },
    {
        nombre: "Práctica shinobi",
        descripcion: "Resuelve un ejercicio de programación.",
        xp: 20
    }
];

const misionesSemanales = [
    {
        nombre: "Desafío del programador",
        descripcion: "Termina un ejercicio completo de programación.",
        xp: 50
    },
    {
        nombre: "Maestro de las bases de datos",
        descripcion: "Completa una práctica de SQL.",
        xp: 50
    },
    {
        nombre: "Desarrollo web",
        descripcion: "Avanza en un proyecto HTML, CSS o JavaScript.",
        xp: 50
    },
    {
        nombre: "Sabiduría shinobi",
        descripcion: "Repasa los temas de tus cursos.",
        xp: 40
    }
];

const misionesEspeciales = [
    {
        nombre: "Primer proyecto web",
        descripcion: "Crea una página web funcional.",
        xp: 100
    },
    {
        nombre: "Arquitecto de datos",
        descripcion: "Diseña una base de datos completa.",
        xp: 150
    },
    {
        nombre: "Programador avanzado",
        descripcion: "Crea un programa utilizando funciones.",
        xp: 150
    }
];


// ===== OBTENER FECHA =====

function obtenerFecha() {

    const fecha = new Date();

    return fecha.getFullYear() + "-" +
        String(fecha.getMonth() + 1).padStart(2, "0") + "-" +
        String(fecha.getDate()).padStart(2, "0");

}


// ===== OBTENER SEMANA =====

function obtenerSemana() {

    const fecha = new Date();

    // Obtener el lunes de esta semana

    const dia = fecha.getDay();

    const diferencia = dia === 0 ? -6 : 1 - dia;

    const lunes = new Date(fecha);

    lunes.setDate(fecha.getDate() + diferencia);

    return lunes.getFullYear() + "-" +
        String(lunes.getMonth() + 1).padStart(2, "0") + "-" +
        String(lunes.getDate()).padStart(2, "0");

}


// ===== RECUPERAR PROGRESO =====

let progresoDiario = JSON.parse(
    localStorage.getItem("lifeOS_diarias")
) || {};

let progresoSemanal = JSON.parse(
    localStorage.getItem("lifeOS_semanales")
) || {};

let progresoEspecial = JSON.parse(
    localStorage.getItem("lifeOS_especiales")
) || {};


if (!Array.isArray(progresoDiario.completadas)) {
    progresoDiario = {};
}

if (!Array.isArray(progresoSemanal.completadas)) {
    progresoSemanal = {};
}

if (!Array.isArray(progresoEspecial.completadas)) {
    progresoEspecial = {};
}


// ===== REINICIAR MISIONES =====

const fechaActual = obtenerFecha();

const semanaActual = obtenerSemana();

if (progresoDiario.fecha !== fechaActual) {

    progresoDiario = {
        fecha: fechaActual,
        completadas: []
    };

}

if (progresoSemanal.semana !== semanaActual) {

    progresoSemanal = {
        semana: semanaActual,
        completadas: []
    };

}

if (!Array.isArray(progresoEspecial.completadas)) {

    progresoEspecial = {
        completadas: []
    };

}


// ===== GUARDAR PROGRESO =====

function guardarProgreso() {

    localStorage.setItem(
        "lifeOS_diarias",
        JSON.stringify(progresoDiario)
    );

    localStorage.setItem(
        "lifeOS_semanales",
        JSON.stringify(progresoSemanal)
    );

    localStorage.setItem(
        "lifeOS_especiales",
        JSON.stringify(progresoEspecial)
    );

}


// ===== MOSTRAR MISIONES =====

function mostrarMisiones(lista, contenedor, progreso) {

    const espacio = document.getElementById(contenedor);

    if (!espacio) {
        return;
    }

    espacio.innerHTML = "";

    lista.forEach(function(mision, indice) {

        const completada = progreso.completadas.includes(indice);

        const tarjeta = document.createElement("div");

        tarjeta.className = "tarjeta-mision";

        tarjeta.innerHTML = `
            <h3>${mision.nombre}</h3>

            <p>${mision.descripcion}</p>

            <div class="recompensa-mision">
                ⚡ +${mision.xp} XP
            </div>

            <button class="boton-mision" ${completada ? "disabled" : ""}>
                ${completada ? "¡Completada! ✓" : "Completar misión"}
            </button>
        `;

        const boton = tarjeta.querySelector("button");

        boton.addEventListener("click", function() {

            if (progreso.completadas.includes(indice)) {
                return;
            }

            progreso.completadas.push(indice);

            guardarProgreso();

            actualizarPantalla();

        });

        espacio.appendChild(tarjeta);

    });

}


// ===== CALCULAR XP =====

function actualizarXP() {

    let xpDiario = 0;
    let xpSemanal = 0;
    let xpEspecial = 0;

    progresoDiario.completadas.forEach(function(indice) {

        if (misionesDiarias[indice]) {
            xpDiario += misionesDiarias[indice].xp;
        }

    });

    progresoSemanal.completadas.forEach(function(indice) {

        if (misionesSemanales[indice]) {
            xpSemanal += misionesSemanales[indice].xp;
        }

    });

    progresoEspecial.completadas.forEach(function(indice) {

        if (misionesEspeciales[indice]) {
            xpEspecial += misionesEspeciales[indice].xp;
        }

    });

    const xpTotal = xpDiario + xpSemanal + xpEspecial;

    localStorage.setItem("lifeOS_xp_misiones", xpTotal);

    const elementoXP = document.getElementById("xpMisiones");

    if (elementoXP) {
        elementoXP.textContent = xpTotal + " XP";
    }

}


// ===== ACTUALIZAR RESUMEN =====

function actualizarPantalla() {

    mostrarMisiones(
        misionesDiarias,
        "listaDiarias",
        progresoDiario
    );

    mostrarMisiones(
        misionesSemanales,
        "listaSemanales",
        progresoSemanal
    );

    mostrarMisiones(
        misionesEspeciales,
        "listaEspeciales",
        progresoEspecial
    );

    const completadas =
        progresoDiario.completadas.length +
        progresoSemanal.completadas.length +
        progresoEspecial.completadas.length;

    const disponibles =
        misionesDiarias.length +
        misionesSemanales.length +
        misionesEspeciales.length -
        completadas;

    const elementoCompletadas =
        document.getElementById("misionesCompletadas");

    const elementoDisponibles =
        document.getElementById("misionesDisponibles");

    if (elementoCompletadas) {
        elementoCompletadas.textContent = completadas;
    }

    if (elementoDisponibles) {
        elementoDisponibles.textContent = disponibles;
    }

    actualizarXP();

    guardarProgreso();

}


// ===== INICIAR SISTEMA =====

actualizarPantalla();

