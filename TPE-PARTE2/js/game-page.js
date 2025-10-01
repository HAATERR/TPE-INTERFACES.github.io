'use strict'

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
    input_comentario.placeholder = '¿cuál es tu opinion?';
    input_comentario.classList.remove('input-comentario-nuevo-null')

}


function publicar(e, btn_cancelar, btn_publicar, input_comentario) {
    e.preventDefault();

    if (!input_comentario.value.trim()) 
       comentario_vacio(input_comentario)
    
        else {

        let mensaje = document.querySelector('.mensaje');
        let mensaje_inside = document.getElementById('mensaje-inside')

        mensaje_inside.innerHTML = 'Comentario publicado.'
        setTimeout (() => mensaje.classList.add('mostrar-mensaje'), 500)
        input_comentario.classList.remove('comentario-nuevo-activo')
        btn_cancelar.classList.remove('mostrar-boton')
        btn_publicar.classList.remove('mostrar-boton')
        input_comentario.classList.remove('input-comentario-nuevo-null')

        let btn_cerrar_mensaje = document.getElementById('btn-cerrar-mensaje')
        let btn_cancelar_comentario = document.getElementById('btn-cancelar-comentario')

        setTimeout( () => cerrarMensaje(e , mensaje), 15000)
        btn_cerrar_mensaje.addEventListener('click', () => cerrarMensaje(e, mensaje))
        btn_cancelar_comentario.addEventListener('click' , () => cancelar_comentario(e, mensaje, mensaje_inside))
    }

}

function cerrarMensaje(e, mensaje) {
    e.preventDefault()
    mensaje.classList.remove('mostrar-mensaje')
}

function cancelar_comentario(e, mensaje, mensaje_inside){
    e.preventDefault()
    mensaje_inside = document.getElementById('mensaje-inside')
    let btn_deshacer = document.getElementById('mensaje-deshacer')

    btn_deshacer.innerHTML = 'Cancelar'
    mensaje_inside.innerHTML = 'Comentario deshecho.'
    mensaje.classList.add('mostrar-mensaje')
    
}

function comentario_vacio(){

    let mensaje_error = document.querySelector('.comentario-vacio')

    mensaje_error.classList.add('comentario-vacio-mostrar')

    let btn_cerrar = document.getElementById('btn-cerrar-advertencia')

    btn_cerrar.addEventListener('click' , () => {
        mensaje_error.classList.remove('comentario-vacio-mostrar')
    })
}

function compartir(){
    
}