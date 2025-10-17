

function random_image() {
    let image_number = Math.random() * 6;

    return Math.floor(image_number) + 1;
}

function getImage() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2D');

    let array_src = [''];
    const img = new Image();
    img.src = array_src[random_image()];

    img.onload = () => {
        const w = img.width;
        const h = img.height;

        const hw = w / 2;
        const hh = h / 2;

        ctx.drawImage(img, 0, 0, halfW, halfH, 0, 0, halfW, halfH);

        
        ctx.drawImage(img, halfW, 0, halfW, halfH, halfW, 0, halfW, halfH);

        ctx.drawImage(img, 0, halfH, halfW, halfH, 0, halfH, halfW, halfH);

        ctx.drawImage(img, halfW, halfH, halfW, halfH, halfW, halfH, halfW, halfH);
    }

    /* let blocka = document.getElementById('blocka');
    blocka.replaceWith(img); */
}

function random_rotation(){
    const grades = [90, 180, 270];
    const rand = Math.random()*grades.length()-1;

    return grades[rand];
}

let btn_play = document.getElementById('btn_play');
btn_play.addEventListener('click', timer_on());

function timer_on() {
    let temp = document.getElementById('temp');
    let tiempo = 60;


    const INTERVAL = setInterval(() => {
        tiempo--;
        temp.innerHTML = `00:${tiempo}`;

        if (tiempo <= 10)
            temp.classList.add("timer");


        if (tiempo <= 0) {
            temp.innerHTML = "Perdiste!";
            temp.classList.remove('timer');
            temp.classList.add('game-lost')
            clearInterval(INTERVAL);
            return;
        }
    }, 1000);

}


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