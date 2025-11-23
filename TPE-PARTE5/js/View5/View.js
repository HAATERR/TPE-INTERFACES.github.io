class View {
    constructor() {
        this.pause_visibility = false;
    }

    changeBirdPos(bird, newY) {
        bird.style.top = newY + "px";
    }

    getBirdBox() {
        return document.getElementById("bird").getBoundingClientRect();
    }

    getTubeBox(tubeEl) {
        return tubeEl.getBoundingClientRect();
    }

    resetBirdPos() {
        const bird = document.getElementById('bird');
        bird.style.top = "200px";
    }


    showGame() {
        document.getElementById("juego-logo").style.display = "none";
        document.getElementById("btn-jugar").style.display = "none";
        document.querySelector(".flappy").style.display = 'block';
        document.querySelector('.juego').style.background = 'none';
        document.getElementById('game-over').style.display = 'none';
        const icon = document.getElementById('icon-pantalla-completa');



        const loading = document.querySelector(".loading");
        loading.style.display = 'flex';
        loading.style.background = 'radial-gradient(at center , var(--BLACK_NEUTRAL) , var(--PRIMARY-SHADOW2))';

        setTimeout(() => {
            loading.style.display = 'none';
        }, 1200);

        this.showCount();

        const btn_change = document.getElementById('btn-pantalla-completa');
        btn_change.style.display = 'block';
        btn_change.style.zIndex = 999;

        icon.src = "assets/pause.png";
        btn_change.classList.add('btn-menu-show');
        this.pause_visibility = true;
    }

    showRestart() {
        const flappy = document.querySelector('.flappy');
        const btn_play = document.getElementById('btn-jugar');
        const img_icon = document.getElementById('juego-logo');
        const btn_full_screen = document.getElementById('btn-pantalla-completa');
        const game_div = document.querySelector('.juego');
        const icon = document.getElementById('icon-pantalla-completa');
        const btn_change = document.getElementById("btn-pantalla-completa");
        const bird = document.getElementById('bird');
        document.getElementById('game-over').style.display = 'none';
        bird.classList.remove('deadeBird');
        bird.classList.remove('show');

        this.closeMenu();
        flappy.style.display = 'none';
        btn_play.style.display = 'block';
        img_icon.style.display = 'block';
        btn_full_screen.style.display = 'block';
        game_div.style.backgroundImage = "url(assets/flappylogo.jpg)";



        icon.src = 'assets/tamano-completo.png';

        btn_change.classList.remove('btn-menu-show');
        this.pause_visibility = false;
    }


    showTube(tube) {
        const el = document.createElement("div");
        el.classList.add("tube");

        if (tube.type === "top") {
            el.classList.add("tube-top");
            el.style.bottom = "auto";
            el.style.top = "0";
        } else {
            el.classList.add("tube-bottom");
            el.style.bottom = "0";
        }

        document.querySelector(".juego").prepend(el);

        el.style.width = tube.getWidth() + "px";
        el.style.height = tube.getHeight() + "px";
        el.style.left = tube.getPosX() + "px";

        return el;
    }




    updateTubes(tubes) {
        const domTubes = document.querySelectorAll(".tube");

        domTubes.forEach((dom, i) => {
            const tube = tubes[i];

            if (tube) {
                dom.style.left = tube.getPosX() + "px";
                dom.style.height = tube.getHeight() + "px";
            } else {
                dom.remove(); // tubo salió de pantalla → eliminar
            }
        });
    }

    hideTubes(tubes) {
        document.querySelectorAll(".tube").forEach(t => t.remove());
        this.closeMenu();
    }


    showMenu() {
        document.querySelector('.pause').style.display = 'flex';
        document.getElementById('btn-pantalla-completa').style.visibility = 'hidden';
        const game_div = document.querySelector('.juego');
        const layers = document.querySelectorAll('.layer');
        const bird = document.getElementById('bird');

        layers.forEach(layer => {
            layer.style.animationPlayState = 'paused';
            layer.style.filter = 'blur(2px)';
        });

        bird.style.animationPlayState = 'paused';
        bird.style.filter = 'blur(2px)';
        game_div.style.border = '1px solid black';
    }

    closeMenu() {
        const menu = document.querySelector('.pause');
        menu.style.display = 'none';

        const bird = document.getElementById('bird');

        const layers = document.querySelectorAll('.layer');
        document.getElementById('btn-pantalla-completa').style.visibility = 'visible';
        layers.forEach(layer => {
            layer.style.animationPlayState = 'running';
            layer.style.filter = "none";

        });

        bird.style.animationPlayState = 'running';
        bird.style.filter = 'none';
    }

    continueGame() {
        this.closeMenu();
    }

    fullScreen() {
        if (!this.pause_visibility) {
            document.documentElement.requestFullscreen();
            document.querySelector('body').style.overflow = 'hidden';
        } else {
            this.showMenu();
        }
    }

    showLost() {

        const bird = document.getElementById("bird");
        const flappy = document.querySelector(".flappy");
        const gameOver = document.getElementById("game-over");
        const btn_pause = document.getElementById('btn-pantalla-completa');

        btn_pause.style.visibility = 'hidden';



        const birdTop = bird.getBoundingClientRect().top;
        bird.style.setProperty('--bird-top', birdTop + "px");

        bird.classList.add('explosion');

        setTimeout(() => {

            bird.classList.remove('explosion');
            bird.classList.add('deadBird');

        }, 500);

        setTimeout( () => {
            document.querySelectorAll('.layer')
            .forEach(l => l.style.animationPlayState = "paused");
        }, 15000);
        

        setTimeout(() => {
            gameOver.style.display = 'flex';
            flappy.style.display = 'none';
            gameOver.classList.add("show");
        }, 2000);
    }

    showCount() {
        const div = document.querySelector('.timer-start');
        const timer = document.getElementById('timer');

        div.style.display = 'block';

        for (let i = 1; i <= 3; i++) {
            timer.innerHTML = `${i}`;
        }

        div.style.display = 'none';
    }

    showScore(score, score_div) {
        score_div.innerHTML = `Puntaje = ${score}`;
    }
}
