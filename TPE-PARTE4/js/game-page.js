'use strict'

// obtengo el comentario
let input_comentario = document.getElementById('input-comentario-nuevo')

input_comentario.addEventListener('focus', () => {

    let btn_cancelar = document.getElementById('btn-cancelar')

    let btn_publicar = document.getElementById('btn-publicar')

    input_comentario.classList.add('comentario-nuevo-activo')

    btn_cancelar.classList.add('mostrar-boton')
    btn_publicar.classList.add('mostrar-boton')

    btn_cancelar.addEventListener('click', (e) => cancelar(e, btn_cancelar, btn_publicar, input_comentario))

    btn_publicar.addEventListener('click', (e) => publicar(e, btn_cancelar, btn_publicar, input_comentario))

});

function cancelar(e, btn_cancelar, btn_publicar, input_comentario) {
    e.preventDefault();
    input_comentario.classList.remove('comentario-nuevo-activo')
    btn_cancelar.classList.remove('mostrar-boton')
    btn_publicar.classList.remove('mostrar-boton')
    btn_cancelar.classList.add('ocultar-boton')
    btn_publicar.classList.add('ocultar-boton')
    input_comentario.classList.remove('input-comentario-nuevo-null')
    input_comentario.placeholder = '¿cuál es tu opinion?'

}


function publicar(e, btn_cancelar, btn_publicar, input_comentario) {
    e.preventDefault();

    if (!input_comentario.value.trim())
        comentario_vacio(input_comentario)

    else {

        let mensaje = document.querySelector('.mensaje');
        let mensaje_inside = document.getElementById('mensaje-inside')

        mensaje_inside.innerHTML = 'Comentario publicado.'
        setTimeout(() => mensaje.classList.add('mostrar-mensaje'), 500)
        input_comentario.classList.remove('comentario-nuevo-activo')
        btn_cancelar.classList.remove('mostrar-boton')
        btn_publicar.classList.remove('mostrar-boton')
        input_comentario.classList.remove('input-comentario-nuevo-null')

        let btn_cerrar_mensaje = document.getElementById('btn-cerrar-mensaje')
        let btn_cancelar_comentario = document.getElementById('btn-cancelar-comentario')
        let btn_aceptar = document.getElementById('btn-aceptar')

        setTimeout(() => cerrarMensaje(e, mensaje), 15000)
        btn_cerrar_mensaje.addEventListener('click', () => cerrarMensaje(e, mensaje))
        btn_cancelar_comentario.addEventListener('click', () => deshacer_comentario(e, mensaje, mensaje_inside))
        btn_aceptar.addEventListener('click', (e) => cerrarMensaje(e, mensaje))
    }

}

function cerrarMensaje(e, mensaje) {
    e.preventDefault()
    mensaje.classList.remove('mostrar-mensaje')
}

function deshacer_comentario(e, mensaje, mensaje_inside) {
    e.preventDefault()
    mensaje_inside = document.getElementById('mensaje-inside')
    let btn_deshacer = document.getElementById('mensaje-deshacer')

    btn_deshacer.innerHTML = 'Cancelar'
    mensaje_inside.innerHTML = 'Comentario deshecho.'
    mensaje.classList.add('mostrar-mensaje')

}

/* COMENTARIO VACIO */
function comentario_vacio() {

    let mensaje_error = document.querySelector('.comentario-vacio')

    mensaje_error.classList.add('comentario-vacio-mostrar')

    let btn_cerrar = document.getElementById('btn-cerrar-advertencia')

    btn_cerrar.addEventListener('click', () => {
        mensaje_error.classList.remove('comentario-vacio-mostrar')
    })
}

// COMPARTIR
let btn_compartir = document.getElementById('btn-compartir');
btn_compartir.addEventListener('click', () => {
    let compartir = document.querySelector('.compartir')

    compartir.classList.toggle('compartir-mostrar')

    setTimeout(() => {
        compartir.classList.remove('compartir-mostrar');
    }, 3000)
})

/* AÑADIR A FAVORITOS */

let btn_favoritos = document.getElementById('favoritos-game-bar');
btn_favoritos.addEventListener('click', () => {
    let favorito = document.createElement('img')
    favorito.src = 'assets/fav_aniadido.png'
    favorito.classList.add('fav_aniadido')
    btn_favoritos.replaceWith(favorito)
});

/* MOSTRAR MENU PERFIL (HEADER) */
let btn_perfil_header = document.getElementById('btn-usuario');
btn_perfil_header.addEventListener('click' , () => {
    let menu_perfil = document.querySelector('.menu-perfil')
    menu_perfil.classList.toggle('menu-perfil-mostrar')
})


/* MOSTRAR MENU HAMBURGUESA */
let btn_menu_hamburguesa = document.getElementById('btn-menu-hamburguesa')
btn_menu_hamburguesa.addEventListener('click' , ()=> {
    let menu_hamburguesa = document.querySelector('.sidebar')
    menu_hamburguesa.classList.toggle('sidebar-mostrar')

})


/* PANTALLA COMPLETA */
document.addEventListener("DOMContentLoaded", () => {
  const btnPantalla = document.getElementById("btn-pantalla-completa");

  if (btnPantalla) {
    btnPantalla.addEventListener("click", pantallaCompleta);
  }
});

function pantallaCompleta() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    document.querySelector('body').style.overflow = 'hidden';
  } else {
    document.exitFullscreen();
    document.querySelector('body').style.overflow = 'auto';
  }
}





