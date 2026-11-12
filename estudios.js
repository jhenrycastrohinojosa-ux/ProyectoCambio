
// ===== CONFIGURACION =====

const nombreTarea = document.getElementById("nombreTarea");
const cursoTarea = document.getElementById("cursoTarea");
const fechaTarea = document.getElementById("fechaTarea");

const btnAgregarTarea = document.getElementById("btnAgregarTarea");
const listaTareas = document.getElementById("listaTareas");

const tareasPendientes = document.getElementById("tareasPendientes");
const xpAcademico = document.getElementById("xpAcademico");


// ===== CARGAR TAREAS =====

let tareas = JSON.parse(
    localStorage.getItem("lifeOS_tareas")
) || [];


// ===== GUARDAR TAREAS =====

function guardarTareas() {

    localStorage.setItem(
        "lifeOS_tareas",
        JSON.stringify(tareas)
    );

}


// ===== REVISAR FECHAS VENCIDAS =====

function revisarVencidas() {

    const hoy = new Date();

    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");

    const fechaHoy = año + "-" + mes + "-" + dia;

    tareas.forEach(function(tarea) {

        if (
            tarea.fecha < fechaHoy &&
            !tarea.completada &&
            !tarea.penalizada
        ) {

            tarea.penalizada = true;

        }

    });

    guardarTareas();

}


// ===== MOSTRAR TAREAS =====

function mostrarTareas() {

    revisarVencidas();

    listaTareas.innerHTML = "";

    tareas.forEach(function(tarea) {

        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta-tarea");

        const informacion = document.createElement("div");

        const titulo = document.createElement("h3");
        titulo.textContent = tarea.nombre;

        const curso = document.createElement("p");
        curso.textContent = "Curso: " + tarea.curso;

        const fecha = document.createElement("p");
        fecha.textContent = "Fecha: " + tarea.fecha;

        const estado = document.createElement("p");

        if (tarea.completada && tarea.penalizada) {
            estado.textContent = "✅ Completada con penalización";
        } else if (tarea.completada) {
            estado.textContent = "✅ Completada";
        } else if (tarea.penalizada) {
            estado.textContent = "⚠️ Vencida: -15 XP";
        } else {
            estado.textContent = "⏳ Pendiente";
        }

        informacion.appendChild(titulo);
        informacion.appendChild(curso);
        informacion.appendChild(fecha);
        informacion.appendChild(estado);

        const acciones = document.createElement("div");

        const botonCompletar = document.createElement("button");

        botonCompletar.textContent =
            tarea.completada ? "Completada" : "Completar";

        botonCompletar.disabled = tarea.completada;

        botonCompletar.addEventListener("click", function() {
            completarTarea(tarea.id);
        });

        const botonEliminar = document.createElement("button");

        botonEliminar.textContent = "Eliminar";

        botonEliminar.addEventListener("click", function() {
            eliminarTarea(tarea.id);
        });

        acciones.appendChild(botonCompletar);
        acciones.appendChild(botonEliminar);

        tarjeta.appendChild(informacion);
        tarjeta.appendChild(acciones);

        listaTareas.appendChild(tarjeta);

    });

    actualizarResumen();

}


// ===== AGREGAR TAREA =====

function agregarTarea() {

    const nombre = nombreTarea.value.trim();
    const curso = cursoTarea.value;
    const fecha = fechaTarea.value;

    if (nombre === "" || curso === "" || fecha === "") {

        alert("Completa todos los campos.");
        return;

    }

    const nuevaTarea = {

        id: Date.now(),
        nombre: nombre,
        curso: curso,
        fecha: fecha,
        completada: false,
        penalizada: false

    };

    tareas.push(nuevaTarea);

    guardarTareas();
    mostrarTareas();

    nombreTarea.value = "";
    cursoTarea.value = "";
    fechaTarea.value = "";

}


// ===== COMPLETAR TAREA =====

function completarTarea(id) {

    tareas.forEach(function(tarea) {

        if (tarea.id === id && !tarea.completada) {

            tarea.completada = true;

        }

    });

    guardarTareas();
    mostrarTareas();

}


// ===== ELIMINAR TAREA =====

function eliminarTarea(id) {

    tareas = tareas.filter(function(tarea) {

        return tarea.id !== id;

    });

    guardarTareas();
    mostrarTareas();

}


// ===== ACTUALIZAR RESUMEN =====

function actualizarResumen() {

    const pendientes = tareas.filter(function(tarea) {

        return !tarea.completada && !tarea.penalizada;

    }).length;

    const completadas = tareas.filter(function(tarea) {

        return tarea.completada;

    }).length;

    const vencidas = tareas.filter(function(tarea) {

        return tarea.penalizada;

    }).length;


    // Calcular XP

    let xp = (completadas * 20) - (vencidas * 15);

    if (xp < 0) {
        xp = 0;
    }


    // Actualizar pantalla

    tareasPendientes.textContent = pendientes;

    xpAcademico.textContent = xp + " XP";


    // Guardar XP

    localStorage.setItem("lifeOS_xp_estudios", xp);

}


// ===== BOTON AGREGAR =====

btnAgregarTarea.addEventListener("click", agregarTarea);


// ===== INICIAR =====

mostrarTareas();



