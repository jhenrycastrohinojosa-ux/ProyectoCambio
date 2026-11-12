
// ===== CONFIGURACION =====

const entradaHabito = document.getElementById("nombreHabito");
const botonAgregar = document.getElementById("btnAgregarHabito");

const filaDias = document.getElementById("filaDias");
const cuerpoHabitos = document.getElementById("cuerpoHabitos");

const totalHabitos = document.getElementById("totalHabitos");
const totalCumplidos = document.getElementById("totalCumplidos");
const xpHabitos = document.getElementById("xpHabitos");

const mensaje = document.getElementById("mensajeHabito");

const fecha = new Date();
const año = fecha.getFullYear();
const mes = fecha.getMonth();

const diasMes = new Date(año, mes + 1, 0).getDate();


// ===== GUARDAR DATOS =====

let habitos = JSON.parse(
    localStorage.getItem("lifeOS_habitos")
) || [];

const claveRegistros =
    "lifeOS_registros_" + año + "_" + mes;

let registros = JSON.parse(
    localStorage.getItem(claveRegistros)
) || {};


// ===== MOSTRAR MES =====

const nombreMes = fecha.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric"
});

document.getElementById("mesActual").textContent = nombreMes;


// ===== CREAR CALENDARIO =====

function crearCalendario() {

    filaDias.innerHTML = "<th>HÁBITOS</th>";

    for (let dia = 1; dia <= diasMes; dia++) {

        let columna = document.createElement("th");

        columna.textContent = dia;

        filaDias.appendChild(columna);

    }

}


// ===== MOSTRAR HABITOS =====

function mostrarHabitos() {

    cuerpoHabitos.innerHTML = "";

    habitos.forEach(function(habito) {

        let fila = document.createElement("tr");

        let nombre = document.createElement("td");

        nombre.textContent = habito.nombre;

        fila.appendChild(nombre);

        for (let dia = 1; dia <= diasMes; dia++) {

            let celda = document.createElement("td");

            let casilla = document.createElement("input");

            casilla.type = "checkbox";
            casilla.className = "casilla-habito";

            casilla.checked = Boolean(
                registros[habito.id] &&
                registros[habito.id][dia]
            );

            casilla.addEventListener("change", function() {

                if (!registros[habito.id]) {
                    registros[habito.id] = {};
                }

                registros[habito.id][dia] = casilla.checked;

                guardarRegistros();

                actualizarResumen();

            });

            celda.appendChild(casilla);

            fila.appendChild(celda);

        }

        cuerpoHabitos.appendChild(fila);

    });

}


// ===== AGREGAR HABITO =====

function agregarHabito() {

    let nombre = entradaHabito.value.trim();

    if (nombre === "") {

        mensaje.textContent = "Escribe el nombre de tu hábito.";

        return;

    }

    let nuevoHabito = {
        id: Date.now().toString(),
        nombre: nombre
    };

    habitos.push(nuevoHabito);

    localStorage.setItem(
        "lifeOS_habitos",
        JSON.stringify(habitos)
    );

    entradaHabito.value = "";

    mensaje.textContent = "¡Nuevo hábito agregado!";

    mostrarHabitos();

    actualizarResumen();

}


// ===== GUARDAR REGISTROS =====

function guardarRegistros() {

    localStorage.setItem(
        claveRegistros,
        JSON.stringify(registros)
    );

}


// ===== ACTUALIZAR ESTADISTICAS =====

function actualizarResumen() {

    let cumplimientos = 0;

    let diasCompletados = {};

    // Contar cumplimientos del mes actual

    for (let id in registros) {

        for (let dia in registros[id]) {

            if (registros[id][dia] === true) {

                cumplimientos++;

                if (!diasCompletados[dia]) {
                    diasCompletados[dia] = 0;
                }

                diasCompletados[dia]++;

            }

        }

    }


    // Contar días con 6 hábitos o más

    let cantidadDias = 0;

    for (let dia in diasCompletados) {

        if (diasCompletados[dia] >= 6) {
            cantidadDias++;
        }

    }


    // Calcular XP mensual

    let experiencia = cumplimientos * 10;

    localStorage.setItem(
        "lifeOS_xp_habitos",
        experiencia
    );

    totalHabitos.textContent = habitos.length;

    totalCumplidos.textContent = cantidadDias;

    xpHabitos.textContent = experiencia + " XP";

    actualizarTransformacion(experiencia);

}


// ===== SISTEMA DE TRANSFORMACIONES =====

function actualizarTransformacion(xp) {

    const niveles = [

        {
            nombre: "Guerrero principiante",
            xp: 0,
            mensaje: "Todo gran guerrero comienza desde cero."
        },

        {
            nombre: "Saiyajin",
            xp: 100,
            mensaje: "¡Has despertado tu verdadero potencial!"
        },

        {
            nombre: "Super Saiyajin",
            xp: 300,
            mensaje: "¡Tu poder sigue aumentando!"
        },

        {
            nombre: "Super Saiyajin Fase 2",
            xp: 600,
            mensaje: "¡Tu disciplina te está llevando más lejos!"
        },

        {
            nombre: "Super Saiyajin Fase 3",
            xp: 1000,
            mensaje: "¡Has superado tus propios límites!"
        },

        {
            nombre: "Super Saiyajin Dios",
            xp: 1500,
            mensaje: "¡Tu entrenamiento alcanza un nuevo nivel!"
        },

        {
            nombre: "Super Saiyajin Blue",
            xp: 2000,
            mensaje: "¡Control, fuerza y disciplina!"
        },

        {
            nombre: "Ultra Instinto",
            xp: 3000,
            mensaje: "¡Has alcanzado el máximo nivel de entrenamiento!"
        }

    ];


    const imagenes = {

        "Guerrero principiante": "img/goku.png",
        "Saiyajin": "img/goku-saiyajin.png",
        "Super Saiyajin": "img/goku-super-saiyajin.png",
        "Super Saiyajin Fase 2": "img/goku-fase2.png",
        "Super Saiyajin Fase 3": "img/goku-fase3.png",
        "Super Saiyajin Dios": "img/goku-dios.png",
        "Super Saiyajin Blue": "img/goku-blue.png",
        "Ultra Instinto": "img/goku-ultra-instinto.png"

    };


    let nivelActual = niveles[0];

    let siguienteNivel = null;

    for (let i = 0; i < niveles.length; i++) {

        if (xp >= niveles[i].xp) {
            nivelActual = niveles[i];
        }

    }

    for (let i = 0; i < niveles.length; i++) {

        if (xp < niveles[i].xp) {

            siguienteNivel = niveles[i];

            break;

        }

    }


    document.getElementById("transformacionActual").textContent =
        nivelActual.nombre;

    document.getElementById("mensajeTransformacion").textContent =
        nivelActual.mensaje;

    document.getElementById("nombreTransformacion").textContent =
        nivelActual.nombre;

    document.getElementById("imagenTransformacion").src =
        imagenes[nivelActual.nombre];


    let porcentaje = 100;

    if (siguienteNivel !== null) {

        let xpNecesarios = siguienteNivel.xp - nivelActual.xp;

        let xpConseguidos = xp - nivelActual.xp;

        porcentaje = (xpConseguidos / xpNecesarios) * 100;

        document.getElementById("textoProgreso").textContent =
            xp + " / " + siguienteNivel.xp +
            " XP para " + siguienteNivel.nombre;

    } else {

        document.getElementById("textoProgreso").textContent =
            "¡Has alcanzado el Ultra Instinto!";

    }

    document.getElementById("progresoTransformacion").style.width =
        porcentaje + "%";

}


// ===== FRASES DE LOS PERSONAJES =====

const frases = [

    {
        personaje: "GOKU",
        texto: "¡No importa cuántas veces caigas, siempre puedes volver a levantarte!"
    },

    {
        personaje: "VEGETA",
        texto: "La disciplina es lo que te hará superar tus propios límites."
    },

    {
        personaje: "NARUTO",
        texto: "¡Nunca abandones tus sueños, sigue avanzando!"
    },

    {
        personaje: "KAKASHI",
        texto: "El verdadero progreso se construye con esfuerzo y constancia."
    },

    {
        personaje: "GOKU",
        texto: "¡Cada día es una nueva oportunidad para hacerte más fuerte!"
    },

    {
        personaje: "VEGETA",
        texto: "Deja de esperar el momento perfecto. Empieza a entrenar."
    },

    {
        personaje: "NARUTO",
        texto: "Aunque el camino sea difícil, nunca pierdas tu determinación."
    }

];


const imagenesPersonajes = {

    "GOKU": "img/goku-mensaje.png",
    "VEGETA": "img/vegeta.png",
    "NARUTO": "img/naruto-mensaje.png",
    "KAKASHI": "img/kakashi.png"

};


// ===== MOSTRAR FRASE =====

function mostrarFraseDelDia() {

    const indice = Math.floor(Math.random() * frases.length);

    const fraseElegida = frases[indice];

    document.getElementById("nombrePersonaje").textContent =
        fraseElegida.personaje;

    document.getElementById("frasePersonaje").textContent =
        fraseElegida.texto;

    document.querySelector(".imagen-mensaje").src =
        imagenesPersonajes[fraseElegida.personaje];

}


// ===== MENSAJE DEL PERSONAJE =====

const mensajePersonaje =
    document.getElementById("mensajePersonaje");

const botonNuevaFrase =
    document.getElementById("btnNuevaFrase");

const botonCerrarMensaje =
    document.getElementById("btnCerrarMensaje");


if (botonNuevaFrase) {

    botonNuevaFrase.addEventListener("click", function() {
        mostrarFraseDelDia();
    });

}

if (botonCerrarMensaje && mensajePersonaje) {

    botonCerrarMensaje.addEventListener("click", function() {
        mensajePersonaje.style.display = "none";
    });

}


// ===== MOVER MENSAJE =====

let moviendo = false;

let posicionX = 0;

let posicionY = 0;


if (mensajePersonaje) {

    mensajePersonaje.addEventListener("pointerdown", function(evento) {

        if (evento.target.closest("button")) {
            return;
        }

        moviendo = true;

        posicionX = evento.clientX;

        posicionY = evento.clientY;

        mensajePersonaje.setPointerCapture(evento.pointerId);

    });


    mensajePersonaje.addEventListener("pointermove", function(evento) {

        if (!moviendo) {
            return;
        }

        let movimientoX = evento.clientX - posicionX;

        let movimientoY = evento.clientY - posicionY;

        const posicionActual =
            mensajePersonaje.getBoundingClientRect();

        let izquierda = posicionActual.left + movimientoX;

        let arriba = posicionActual.top + movimientoY;

        izquierda = Math.max(
            0,
            Math.min(
                izquierda,
                window.innerWidth - mensajePersonaje.offsetWidth
            )
        );

        arriba = Math.max(
            0,
            Math.min(
                arriba,
                window.innerHeight - mensajePersonaje.offsetHeight
            )
        );

        mensajePersonaje.style.position = "fixed";

        mensajePersonaje.style.left = izquierda + "px";

        mensajePersonaje.style.top = arriba + "px";

        mensajePersonaje.style.margin = "0";

        mensajePersonaje.style.zIndex = "1000";

        posicionX = evento.clientX;

        posicionY = evento.clientY;

    });


    mensajePersonaje.addEventListener("pointerup", function() {
        moviendo = false;
    });

    mensajePersonaje.addEventListener("pointercancel", function() {
        moviendo = false;
    });

}


// ===== BOTON AGREGAR HABITO =====

if (botonAgregar) {
    botonAgregar.addEventListener("click", agregarHabito);
}

if (entradaHabito) {

    entradaHabito.addEventListener("keydown", function(evento) {

        if (evento.key === "Enter") {
            agregarHabito();
        }

    });

}


// ===== INICIAR PAGINA =====

crearCalendario();

mostrarHabitos();

actualizarResumen();

mostrarFraseDelDia();


