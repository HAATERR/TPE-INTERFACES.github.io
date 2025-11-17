class View {
    constructor() {

    }

    showGame() {
        document.getElementById("juego-logo").style.display = "none";
        document.getElementById("btn-jugar").style.display = "none";
        document.querySelector(".flappy").style.display = "flex";
        document.querySelector('.juego').style.background = 'none';

        const loading = document.querySelector(".loading");
        loading.style.display = 'flex';
        loading.style.background = 'radial-gradient(at center , var(--BLACK_NEUTRAL) , var(--PRIMARY-SHADOW2))';

        setTimeout(() => {
            loading.style.display = 'none';
        }, 1200);

        const btn_change = document.getElementById('btn-pantalla-completa');
        btn_change.style.display = 'block';
        btn_change.style.zIndex = 999;

        const img = new Image;
        img.src = 'assets/pause.png';
        document.getElementById('icon-pantalla-completa').replaceWith(img);
        btn_change.classList.add('btn-menu-show');
        this.pause_visibility = true;
    }

    showRestart() {
        const flappy = document.querySelector('.flappy');
        const btn_play = document.getElementById('btn-jugar');
        const img_icon = document.getElementById('juego-logo');
        const btn_full_screen = document.getElementById('btn-pantalla-completa');
        
        this.closeMenu();
        flappy.style.display = 'none';
        btn_play.style.display = 'block';
        img_icon.style.display = 'block';
        btn_full_screen.style.display = 'block';
    }

    continueGame(){
        this.closeMenu();
    }

    closeMenu(){
        const menu = document.querySelector('.pause');
        menu.style.display = 'none';
        const layers = document.querySelectorAll('.layer');
        document.getElementById('btn-pantalla-completa').style.visibility = 'visible';
        layers.forEach(layer => {
            // layer.style.animationPlayState = 'none';
            layer.style.filter = "none";

        });
    }

    showMenu() {
        document.querySelector('.pause').style.display = 'flex';
        document.getElementById('btn-pantalla-completa').style.visibility = 'hidden';
        const game_div = document.querySelector('.juego');
        const layers = document.querySelectorAll('.layer');


        layers.forEach(layer => {
            layer.style.animationPlayState = 'none';
            layer.style.filter = 'blur(2px)';
        });

        game_div.style.border= '1px solid black';
    }

    fullScreen() {
        if (!this.pause_visibility) {
            document.documentElement.requestFullscreen();
            document.querySelector('body').style.overflow = 'hidden';
        } else {
            this.openMenu();
        }
    }
}