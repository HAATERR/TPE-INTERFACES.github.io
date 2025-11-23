class Controller {

    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.addListeners();
        this.lastTubeCount = 0;
        this.lastAltBirdCount = 0;

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

        this.model.init();

        this.view.resetBirdPos();
        this.view.hideTubes();

        this.lastTubeCount = 0;

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


    checkCollisions() {
        const birdBox = this.view.getBirdBox();
        const gameBox = document.querySelector('.juego').getBoundingClientRect();

        const tubeElements = document.querySelectorAll(".tube");
        tubeElements.forEach((tubeEl) => {

            const tubeBox = this.view.getBox(tubeEl);

            if (this.model.checkFlappyTouch(birdBox, tubeBox) || this.model.checkFlappyOutGame(birdBox, gameBox)) {
                this.endGame();
            }
        });

        const altBirds = document.querySelectorAll('.alternative-bird');
        altBirds.forEach((alt_bird) => {
            const altBirdBox = this.view.getBox(alt_bird);

            if (this.model.checkFlappyTouch(birdBox, altBirdBox) || this.model.checkFlappyOutGame(birdBox, gameBox)) {
                this.endGame();
            }
        }
        )
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

        const bird = document.getElementById('bird');
        this.model.applyGravity();
        this.view.changeBirdPos(bird, this.model.birdY);


        this.model.updateTubes(timestamp);
        this.model.updateAltBirds(timestamp);

        if (this.model.tubes.length > this.lastTubeCount) {

            for (let i = this.lastTubeCount; i < this.model.tubes.length; i++) {
                this.view.showTube(this.model.tubes[i]);   
            }

            this.lastTubeCount = this.model.tubes.length;
        }


        if (this.model.altBirds.length > this.lastAltBirdCount) {

            for (let i = this.lastAltBirdCount; i < this.model.altBirds.length; i++) {
                this.view.showAltBirds(this.model.altBirds[i]);
            }

            this.lastAltBirdCount = this.model.altBirds.length;
        }

        this.view.updateAltBirds(this.model.altBirds);

        this.model.tubePassed(
            this.view.getBirdBox().left
        );

        this.view.updateTubes(this.model.tubes);

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
