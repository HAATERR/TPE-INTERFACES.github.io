class Controller {

    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.addListeners();
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

        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowUp") {
                e.preventDefault();
                this.moveUpBird();
            }

            if (e.key === "ArrowDown") {
                e.preventDefault();
                this.moveDownBird();
            }
        });

    }

    startGame() {
        this.pause_visibility = true;
        this.view.showGame();
    }

     restartGame() {
        this.view.showRestart();
    }

    continueGame(){
        this.view.continueGame();
    }

     evaluateScreenMenu() {
        if (this.view.pause_visibility) {
            this.view.showMenu();
        }else{
            this.view.fullScreen();
        }

        
    }

    moveUpBird() {
        const game = document.querySelector('.juego');
        const newY = this.model.birdUp(game.getBoundingClientRect().height);
        const bird = document.getElementById('bird');

        this.view.changeBirdPos(bird, newY);
        if(this.model.checkLost())
            this.endGame();
    }

    moveDownBird() {
        const game = document.querySelector('.juego');
        const newY = this.model.birdDown(game.getBoundingClientRect().height);
        const bird = document.getElementById('bird');

        this.view.changeBirdPos(bird, newY);
        this.checkCollisions();
        if(this.model.checkLost())
            this.endGame();
    }

    checkCollisions() {
        const birdBox = this.view.getBirdBox();

        const tubeElements = document.querySelectorAll(".tube");
        tubeElements.forEach((tubeEl) => {

            const tubeBox = this.view.getTubeBox(tubeEl);

            if (this.model.checkFlappyTouch(birdBox, tubeBox)) {
                this.endGame();
            }
        });
    }

    endGame() {
        alert('perdio');
    }

    timerOn(timestamp) {

    }

    handleGameOver() {

    }

    handleGameWin() {

    }
}
