'use strict'

let input_comentario = document.getElementById('input-comentario-nuevo')




input_comentario.addEventListener('focus', () => {

    let btn_cancelar = document.getElementById('btn-cancelar')

    let btn_publicar = document.getElementById('btn-publicar')

    let form_comentario = document.getElementById('form-comentario-nuevo')

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
}


function publicar(e, btn_cancelar, btn_publicar, input_comentario) {
    e.preventDefault();

    // CHEQUEAR SI NO ES NULL //
    
    let mensaje = document.querySelector('.mensaje');
    let mensaje_inside = document.getElementById('mensaje-inside')

    mensaje_inside.innerHTML = 'Comentario publicado.'
    mensaje.classList.add('mostrar-mensaje')
    input_comentario.classList.remove('comentario-nuevo-activo')
    btn_cancelar.classList.remove('mostrar-boton')
    btn_publicar.classList.remove('mostrar-boton')


}
