class Controller {

    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.lastTubeCount = 0;
        this.lastAltBirdCount = 0;

        this.onpause = true;
        this.frameId = null;

        this.gameStartTime = null;

        this.allowGravity = false;

        this.timeLeft = 90000;
        this.intervalTimer = null;

        this.addListeners();
    }

    addListeners() {
        const btn_play = document.getElementById('btn-jugar');
        btn_play.addEventListener('click', () => this.startGame());

        const btn_full_menu = document.getElementById('btn-pantalla-completa');
        btn_full_menu.addEventListener('click', () => this.evaluateScreenMenu());

        const btn_restart = document.getElementById('btn-restart');
        if (btn_restart)
            btn_restart.addEventListener('click', () => this.restartGame());

        const btn_continue = document.getElementById('btn-continue');
        if (btn_continue)
            btn_continue.addEventListener('click', () => this.continueGame());

        const close_menu = document.getElementById('close-menu');
        if (close_menu)
            close_menu.addEventListener('click', () => this.view.closeMenu());

        const retry = document.getElementById('retry-btn');
        if (retry)
            retry.addEventListener('click', () => this.restartGame());

        const winRetry = document.getElementById("win-retry-btn");
        if (winRetry)
            winRetry.addEventListener("click", () => this.restartGame());


        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowUp" || e.code === "Space") {
                e.preventDefault();
                if (!this.onpause) this.model.jump();
            }
        });

        document.addEventListener('click', (e) => {
            e.preventDefault();
            if (!this.onpause) this.model.jump();
        });
    }

    startGame() {
        this.onpause = false;
        this.pause_visibility = true;
        this.gameStartTime = null;

        const bird = document.getElementById('bird');
        if (bird) {
            bird.classList.add("bird-fly");

            bird.style.animationPlayState = 'running';
            bird.style.filter = 'none';
        }

        this.view.showGame();
        this.startVisibleTimer();

        setTimeout(() => {
            if (this.onpause) return;

            this.allowGravity = true;
            this.frameId = requestAnimationFrame((t) => this.timerOn(t));
        }, 1200);
    }

    startVisibleTimer() {
        this.view.startTimer();
    }


    winByTime() {
        this.onpause = true;

        if (this.frameId) cancelAnimationFrame(this.frameId);

        this.model.restartTubes();
        this.lastTubeCount = 0;
        this.lastAltBirdCount = 0;

        this.handleGameWin();
    }

    continueGame() {
        this.onpause = false;
        this.view.closeMenu();
        this.frameId = requestAnimationFrame(t => this.timerOn(t));
    }


    restartGame() {
        this.onpause = true;
        this.allowGravity = false;

        if (this.frameId) cancelAnimationFrame(this.frameId);

        this.model.init();
        this.lastTubeCount = 0;
        this.lastAltBirdCount = 0;
        this.model.altBirds = [];

        document.querySelectorAll(".tube").forEach(el => el.remove());
        document.querySelectorAll(".alternative-bird").forEach(el => el.remove());

        const bird = document.getElementById('bird');

        bird.classList.remove("explosion", "deadBird", "win-celebrate");
        bird.classList.add("bird-fly");   // ← AQUI

        bird.style.opacity = "1";
        bird.style.display = "block";
        bird.style.filter = "none";

        this.view.closeMenu();
        if (this.view.hideLost) this.view.hideLost();
        if (this.view.hideWin) this.view.hideWin();
        this.view.showGame();

        this.gameStartTime = null;
        this.onpause = false;

        if (this.intervalTimer) clearInterval(this.intervalTimer);
        this.startVisibleTimer();

        setTimeout(() => {
            if (!this.onpause) {
                this.allowGravity = true;
                this.frameId = requestAnimationFrame((t) => this.timerOn(t));
            }
        }, 1200);
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
        const birdBox = this.view.getReducedBirdBox();
        const gameBox = document.querySelector('.juego').getBoundingClientRect();
        const tubeElements = document.querySelectorAll(".tube");
        const altBirds = document.querySelectorAll('.alternative-bird');

        if (this.model.checkFlappyOutGame(birdBox, gameBox)) {
            return true;
        }


        for (const tubeEl of tubeElements) {
            const tubeBox = this.view.getReducedTubeBox(tubeEl);

            if (this.model.checkFlappyTouch(birdBox, tubeBox)) {
                return true;
            }
        }

        for (const bird of altBirds) {
            const altBirdBox = this.view.getReducedTubeBox(bird);

            if (this.model.checkFlappyTouch(birdBox, altBirdBox)) {
                return true;
            }
        }

        // 3) ¿Toca un bonus?
        const bonusElements = document.querySelectorAll(".bonus");

        for (let i = 0; i < this.model.bonus.length; i++) {
            const bon = this.model.bonus[i];
            const dom = bonusElements[i];
            if (!dom) continue;   // ← evita el error

            const bonBox = dom.getBoundingClientRect();


            if (this.model.checkFlappyBonus(birdBox, bonBox)) {

                // sumar puntos
                this.model.updateScore(5);

                // animación visual
                this.view.playBonusEffect(bon.getPosX(), bon.getPosY());

                // eliminar bonus del model y del DOM
                this.model.bonus.splice(i, 1);
                dom.remove();

                break; // evitar saltos de índice
            }
        }
        return false;
    }


    endGame() {
        this.onpause = true;

        if (this.frameId) {
            cancelAnimationFrame(this.frameId);
            this.frameId = null;
        }
        if (this.intervalTimer) clearInterval(this.intervalTimer);

        const lost = this.model.checkLost();

        if (lost) {
            this.model.restartTubes();
            this.lastTubeCount = 0;
            this.lastAltBirdCount = 0;

            document.querySelectorAll(".tube").forEach(el => el.remove());

            this.handleGameLost();
            return;
        }

        const win = this.model.checkWin();
        if (win) {
            this.handleGameWin();
        }
    }

    timerOn(timestamp) {
        if (this.onpause) return;

        if (this.gameStartTime === null) {
            this.gameStartTime = timestamp;
        }

        const elapsed = timestamp - this.gameStartTime;
        const bird = document.getElementById('bird');

        if (this.allowGravity) {
            this.model.applyGravity();
            this.view.changeBirdPos(this.model.birdY);  // solo esto
        }

        this.model.updateTubes(timestamp);
        this.model.updateAltBirds(timestamp);
        this.model.updateBonus(timestamp);

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

        if (this.model.bonus.length > this.lastBonusCount) {
            for (let i = this.lastBonusCount; i < this.model.bonus.length; i++) {
                this.view.showBonus(this.model.bonus[i]);
            }
            this.lastBonusCount = this.model.bonus.length;
        }


        this.view.updateAltBirds(this.model.altBirds);
        this.view.updateTubes(this.model.tubes);
        this.view.updateBonus(this.model.bonus);


        this.model.tubePassed(this.view.getBirdBox().left);
        this.playerScore();

        if (elapsed > 500 && (this.checkCollisions() || this.model.checkLost() || this.model.checkWin())) {
            this.endGame();
            return;
        }

        this.frameId = requestAnimationFrame((t) => this.timerOn(t));
    }


    playerScore() {
        const score_div = document.querySelector('.score');
        this.view.showScore(this.model.score, score_div);
    }

    handleGameWin() {
        this.view.showWin(this.model.score);
    }


    handleGameLost() { this.view.showLost(); }
}
