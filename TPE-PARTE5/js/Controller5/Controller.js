class Controller {

    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.addListeners();
        this.lastTubeCount = 0;

    }

    addListeners() {

        const btn_play = document.getElementById('btn-jugar');
        btn_play.addEventListener('click', () => this.startGame());

        const btn_full_menu = document.getElementById('btn-pantalla-completa');
        btn_full_menu.addEventListener('click', () => this.evaluateScreenMenu());

        const btn_restart = document.getElementById('btn-restart');
        btn_restart.addEventListener('click', () => this.restartGame());

        const btn_continue = document.getElementById('btn-continue');
        btn_continue.addEventListener('click', () => this.continueGame());

        const close_menu = document.getElementById('close-menu');
        close_menu.addEventListener('click', () => this.view.closeMenu());

        const continue_menu = document.getElementById('btn-continue');
        continue_menu.addEventListener('click', () => this.continueGame());

        const retry = document.getElementById('retry-btn');
        retry.addEventListener('click', () => this.restartGame());

        document.addEventListener("keydown", (e) => {

            if (e.key === "ArrowUp" || e.code === "Space") {
                e.preventDefault();
                this.model.jump();
            }
        });

        document.addEventListener('click', (e) => {
                e.preventDefault();
                this.model.jump();
        });


        this.onpause = false;

    }

    startGame() {
        this.pause_visibility = true;
        const bird = document.getElementById('bird');
        bird.style.animationPlayState = 'running';
        bird.style.filter = 'none';

        this.view.showGame();
        setTimeout(() => {
            requestAnimationFrame((t) => this.timerOn(t));
        }, 1200);

    }

    restartGame() {
        this.onpause = false;

        // Resetear modelo
        this.model.init();

        // Resetear vista
        this.view.resetBirdPos();
        this.view.hideTubes();

        // Resetear contador de tubos nuevos
        this.lastTubeCount = 0;

        // Empezar desde cero
        this.startGame(this.model.tubes);
    }


    continueGame() {
        this.onpause = false;
        this.view.continueGame();
        requestAnimationFrame((t) => this.timerOn(t));
    }

    evaluateScreenMenu() {
        if (this.view.pause_visibility) {
            this.onpause = true;
            this.view.showMenu();
        } else {
            this.view.fullScreen();
        }


    }

    /*
    moveUpBird() {
        const game = document.querySelector('.juego');
        const newY = this.model.jump();
        const bird = document.getElementById('bird');


        this.view.changeBirdPos(bird, newY);
        if (this.model.checkLost())
            this.endGame();
    }

    moveDownBird() {
        const game = document.querySelector('.juego');
        const newY = this.model.birdDown(game.getBoundingClientRect().height);
        const bird = document.getElementById('bird');

        this.view.changeBirdPos(bird, newY);

        if (this.model.checkLost())
            this.endGame();
    }
        */

    checkCollisions() {
        const birdBox = this.view.getBirdBox();
        const gameBox = document.querySelector('.juego').getBoundingClientRect();

        const tubeElements = document.querySelectorAll(".tube");
        tubeElements.forEach((tubeEl) => {

            const tubeBox = this.view.getTubeBox(tubeEl);

            if (this.model.checkFlappyTouch(birdBox, tubeBox) || this.model.checkFlappyOutGame(birdBox, gameBox)) {
                this.endGame();
            }
        });
    }

    endGame() {
        if (this.model.checkLost()) {
            this.model.restartTubes();
            this.view.hideTubes(this.model.tubes);
            this.handleGameLost();
            return;
        }

        if (this.model.checkWin()) {
            this.handleGameWin();
        }
    }

    timerOn(timestamp) {
        if (this.onpause) return;

        /*
        const game_height = document.querySelector('.juego').getBoundingClientRect().top;
        this.model.birdDown(game_height);
        */
        const bird = document.getElementById('bird');
        this.model.applyGravity();
        this.view.changeBirdPos(bird, this.model.birdY);


        this.model.updateTubes(timestamp);

        // Detectar si pasó un tubo y sumar score
        this.model.tubePassed(
            this.view.getBirdBox().left
        );

        // Crear elementos visuales solo para tubos nuevos
        if (this.model.tubes.length > this.lastTubeCount) {

            for (let i = this.lastTubeCount; i < this.model.tubes.length; i++) {
                this.view.showTube(this.model.tubes[i]);
            }

            this.lastTubeCount = this.model.tubes.length;
        }

        // Mover tubos en pantalla
        this.view.updateTubes(this.model.tubes);

        // Colisiones
        if (this.checkCollisions()) {
            this.endGame();
            return;
        }

        if (this.model.checkLost()) {
            this.endGame();
            return;
        }

        if (!this.model.checkLost()) {
            requestAnimationFrame((t) => this.timerOn(t));
        }




        // Actualizar marcador en pantalla
        this.playerScore();
    }


    playerScore() {
        const score_div = document.querySelector('.score');
        const actual_score = this.model.score;
        this.view.showScore(actual_score, score_div);
    }

    handleGameWin() {

    }

    handleGameLost() {
        this.view.showLost();
    }
}
