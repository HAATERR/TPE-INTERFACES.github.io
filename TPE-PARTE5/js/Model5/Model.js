class Model {
    constructor(tube) {
        this.tube = tube; // el objeto tubo

        this.score = 0; // el puntaje del usuario (cuantos tubos paso + bonus)
        this.amountTube = 20; // la cantidad de tubos del nivel
        this.currentTube = 0; // el tubo por el que va el usuario
        this.tubes = []; // la lista de tubos

        this.minTubeDistance = 200; // la distancia entre tubos

        this.birdMovementDif = 20; // salto del pajaro
        this.birdMovementVel = 1; // segundos que tarda el bird en moverse

        this.tubeMovementVel = 3; // velocidad del tubo
        this.lastTubeMade = 0; // el ultimo tubo hecho

        this.birdState = "alive"; // estado del pajaro
        this.birdY = 200; // pos inicial del pajaro
        this.game_width = document.querySelector(".juego").getBoundingClientRect().width; // ancho del juego

        this.amountTubesCreated = 0; // cantidad de tubos creados por el momento

        this.gravity = 0.5;
        this.jumpStrength = -8;
        this.birdVelocity = 0;

        this.init();
    }

    init() {
        this.score = 0;
        this.currentTube = 0;
        this.restartTubes();
        this.birdState = "alive";
        this.birdY = 200;
        const bird = document.getElementById("bird");
        bird.style.top = "200px";
    }

    restartTubes() {
        this.tubes = [];
    }

    createTube() {

        if (this.amountTubesCreated >= this.amountTube) return;

        const gap = this.minTubeDistance;
        const totalHeight = document.querySelector(".juego").getBoundingClientRect().height;

        const topHeight = Math.floor(Math.random() * 200) + 50;

        const bottomHeight = totalHeight - topHeight - gap;

        const posX = this.game_width;

        const topTube = new Tube(40, topHeight, posX, "top");
        const bottomTube = new Tube(40, bottomHeight, posX, "bottom");

        this.tubes.push(topTube, bottomTube);

        this.amountTubesCreated += 1;
    }




    updateTubes(timestamp) {

        if (timestamp - this.lastTubeMade > 2000) {
            this.createTube();
            this.lastTubeMade = timestamp;
        }

        this.tubes.forEach(tube => {
            tube.setPosX(tube.getPosX() - this.tubeMovementVel);
        });

        const oldLength = this.tubes.length;

        this.tubes = this.tubes.filter(tube =>
            tube.getPosX() > -tube.getWidth()
        );

        const removed = oldLength - this.tubes.length;

        if (removed > 0) {
            this.currentTube = Math.max(0, this.currentTube - removed);
        }
    }


    generateSecondaryCharacter() {
        // idea: crear un personaje secundario en un momento random
        // agregar una funcion que verifique si no lo toco
        // si no lo toco, bonus
        // modificar la forma de subir puntaje y de evaluar si ganaste
    }

    /*
    birdUp(gameHeight) {
        const newY = this.birdY - this.birdMovementDif;

        if (newY < 0) {
            this.birdState = "dead";
        }

        this.birdY = newY;
        return this.birdY;
    }

    birdDown(gameHeight) {
        const newY = this.birdY + this.gravity;

        if (newY > gameHeight) {
            this.birdState = "dead";
        }

        this.birdY = newY;
        return this.birdY;
    }
        */

    applyGravity() {

        // agregar gravedad a la velocidad
        this.birdVelocity += this.gravity;

        // mover
        this.birdY += this.birdVelocity;

        return this.birdY;
    }

    jump() {
        // impulso instantáneo
        this.birdVelocity = this.jumpStrength;
    }

    checkFlappyTouch(birdBox, tubeBox) {
        const overlapX =
            birdBox.left <= tubeBox.right &&
            birdBox.right >= tubeBox.left;

        const overlapY =
            birdBox.top <= tubeBox.bottom &&
            birdBox.bottom >= tubeBox.top;

        if (overlapX && overlapY) {
            this.birdState = "dead";
            return true;
        }
        return false;
    }

    checkFlappyOutGame(birdBox, gameBox) {
        if (birdBox.top <= gameBox.top) {
            this.birdState = "dead";
            return true;
        }

        if (birdBox.bottom >= gameBox.bottom) {
            this.birdState = "dead";
            return true;
        }

        return false;
    }


    tubePassed(bird_left) {

        const tube = this.tubes[this.currentTube];

        if (!tube) return false;

        const passed = bird_left > (tube.getPosX() + tube.getWidth());

        if (passed) {
            if (tube.type === "bottom") {
                this.updateScore();
            }
            this.currentTube++;
        }

        return passed;
    }

    updateScore() {
        this.score++;
    }

    checkLost() {
        return this.birdState === "dead";
    }

    checkWin() {
        return this.score === this.amountTube;
    }

    checkCollisions() {
        const birdBox = this.view.getBirdBox();
        const gameBox = document.querySelector('.juego').getBoundingClientRect();

        const tubeElements = document.querySelectorAll(".tube");
        for (const tubeEl of tubeElements) {

            const tubeBox = this.view.getTubeBox(tubeEl);

            if (this.model.checkFlappyTouch(birdBox, tubeBox) ||
                this.model.checkFlappyOutGame(birdBox, gameBox)) {
                return true; // <──✔
            }
        }

        return false;
    }





}
