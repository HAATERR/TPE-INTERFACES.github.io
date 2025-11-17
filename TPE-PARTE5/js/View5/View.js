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
        const front = document.querySelector('.juego');

        flappy.style.display = 'none';
        front.style.display = 'block';
    }

    showMenu() {
        document.querySelector('.pause').style.display = 'flex';

        const layers = document.querySelectorAll('.layer');


        layers.forEach(layer => {
            layer.style.animationPlayState = 'none';
        });
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