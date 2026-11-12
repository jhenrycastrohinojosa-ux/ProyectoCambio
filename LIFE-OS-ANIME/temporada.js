
// ===== SISTEMA DE TEMPORADAS LIFE OS =====

// Obtener el mes y año actual

const fechaTemporada = new Date();

const temporadaActual =
    fechaTemporada.getFullYear() + "-" +
    String(fechaTemporada.getMonth() + 1).padStart(2, "0");


// Recuperar la temporada guardada

const temporadaAnterior =
    localStorage.getItem("lifeOS_temporada");


// ===== COMPROBAR CAMBIO DE MES =====

if (temporadaAnterior === null) {

    // Primera ejecución: conservar los datos existentes

    localStorage.setItem("lifeOS_temporada", temporadaActual);

} else if (temporadaAnterior !== temporadaActual) {

    // ===== REINICIAR XP =====

    localStorage.setItem("lifeOS_xp_habitos", 0);
    localStorage.setItem("lifeOS_xp_estudios", 0);
    localStorage.setItem("lifeOS_xp_misiones", 0);
    localStorage.setItem("lifeOS_xp_misiones_inicio", 0);
    localStorage.setItem("lifeOS_xp_total", 0);


    // ===== REINICIAR TAREAS =====

    localStorage.removeItem("lifeOS_tareas");


    // ===== REINICIAR MISIONES =====

    localStorage.removeItem("lifeOS_diarias");
    localStorage.removeItem("lifeOS_semanales");
    localStorage.removeItem("lifeOS_especiales");

    localStorage.removeItem("lifeOS_misiones_completadas");
    localStorage.removeItem("lifeOS_misiones_inicio_completadas");


    // ===== REINICIAR REGISTROS DE HABITOS =====

    for (let i = localStorage.length - 1; i >= 0; i--) {

        const clave = localStorage.key(i);

        if (clave && clave.startsWith("lifeOS_registros_")) {
            localStorage.removeItem(clave);
        }

    }


    // ===== GUARDAR NUEVA TEMPORADA =====

    localStorage.setItem("lifeOS_temporada", temporadaActual);

    console.log("¡Nueva temporada LIFE OS!");

}

