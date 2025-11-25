class View {
    constructor() {
        this.pause_visibility = false;
    }

    changeBirdPos(newY) {
        const wrapper = document.getElementById("bird-wrapper");
        wrapper.style.top = newY + "px";
    }


    getBirdBox() {
        const bird = document.getElementById("bird");
        return bird.getBoundingClientRect();
    }

    getTubeBox(tubeEl) {
        return tubeEl.getBoundingClientRect();
    }

    getReducedBirdBox() {
        const box = this.getBirdBox();
        const reduce = 5;
        return {
            top: box.top + reduce,
            bottom: box.bottom - reduce,
            left: box.left + reduce,
            right: box.right - reduce
        };
    }

    getReducedTubeBox(tubeEl) {
        const box = tubeEl.getBoundingClientRect();
        return {
            top: box.top + 5,
            bottom: box.bottom - 5,
            left: box.left + 5,
            right: box.right - 5
        };
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

    showAltBirds(altBird) {
        const el = document.createElement("div");
        el.classList.add("alternative-bird");

        el.style.position = "absolute";
        el.style.width = altBird.getWidth() + "px";
        el.style.height = altBird.getHeight() + "px";
        el.style.left = altBird.getPosX() + "px";
        el.style.top = altBird.posY + "px";

        document.querySelector(".juego").appendChild(el);
    }
/*
    showBonus(bonus) {
        const el = document.createElement("div");
        el.classList.add("bonus");

        el.style.position = "absolute";
        el.style.width = bonus.getWidth() + "px";
        el.style.height = bonus.getHeight() + "px";
        el.style.left = bonus.getPosX() + "px";
        el.style.top = bonus.getPosY() + "px";

        document.querySelector(".juego").appendChild(el);
    }
        */

    updateAltBirds(birds) {
        const domBirds = document.querySelectorAll(".alternative-bird");

        domBirds.forEach((dom, i) => {
            const bird = birds[i];

            if (bird) {
                dom.style.left = bird.getPosX() + "px";
                dom.style.top = bird.getPosY() + "px";
            } else {
                dom.remove();
            }
        });
    }



    updateTubes(tubes) {
        const domTubes = document.querySelectorAll(".tube");

        domTubes.forEach((dom, i) => {
            const tube = tubes[i];

            if (tube) {
                dom.style.left = tube.getPosX() + "px";
                dom.style.height = tube.getHeight() + "px";
            } else {
                dom.remove();
            }
        });
    }
/*
    updateBonus(bonus) {
        const domBonus = document.querySelectorAll(".bonus");

        domBonus.forEach((dom, i) => {
            const bon = bonus[i];

            if (bon) {
                dom.style.left = bon.getPosX() + "px";
            } else {
                dom.remove();
            }
        });
    }
*/

    hideTubes() {
        document.querySelectorAll(".tube").forEach(t => t.remove());
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
        document.querySelectorAll('.layer').forEach(layer => {
            layer.style.animationPlayState = 'running';
            layer.style.filter = "none";
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

    hideLost() {
        const gameOver = document.getElementById("game-over");
        gameOver.style.display = "none";
        gameOver.classList.remove("show");
    }


    showLost() {

        const bird = document.getElementById("bird");
        const flappy = document.querySelector(".flappy");
        const gameOver = document.getElementById("game-over");
        const btn_pause = document.getElementById('btn-pantalla-completa');

        btn_pause.style.visibility = 'hidden';

        // OCULTAR pájaros alternativos cuando pierde
        document.querySelectorAll(".alternative-bird").forEach(el => el.style.display = "none");

        const birdTop = bird.getBoundingClientRect().top;
        bird.style.setProperty('--bird-top', birdTop + "px");

        bird.classList.add('explosion');

        setTimeout(() => {
            bird.classList.remove('explosion');
            bird.classList.add('deadBird');
        }, 500);

        setTimeout(() => {
            gameOver.style.display = 'flex';
            flappy.style.display = 'none';
            gameOver.classList.add("show");
        }, 2000);
    }

    showWin(score) {
        const bird = document.getElementById("bird");
        const wrapper = document.getElementById("bird-wrapper");
        const win = document.getElementById("game-win");
        const flappy = document.querySelector(".flappy");

        flappy.style.display = "block";

        // Limpiar animaciones anteriores del pájaro
        bird.classList.remove("explosion", "deadBird");

        // Resetear animación del wrapper
        wrapper.classList.remove("win-celebrate");
        void wrapper.offsetHeight;
        wrapper.classList.add("win-celebrate");

        // Ocultar elementos del juego
        document.querySelectorAll(".tube").forEach(el => el.remove());
        document.querySelectorAll(".alternative-bird").forEach(el => el.remove());

        // Mostrar cartel de victoria después del tiempo de la animación
        setTimeout(() => {
            win.querySelector("#win-score").textContent = `Puntaje final: ${score}`;
            win.style.display = "flex";
            win.classList.add("show");

            flappy.style.display = "none";
        }, 1600); // coincide con duración de la animación
    }


    hideWin() {
        const gameWin = document.getElementById("game-win");
        gameWin.classList.remove("show");
        gameWin.style.display = "none";
    }


    showScore(score, score_div, amount) {
        score_div.innerHTML = `Tubos = ${score}/${amount}` ;
    }

    startTimer() {
    }
}
