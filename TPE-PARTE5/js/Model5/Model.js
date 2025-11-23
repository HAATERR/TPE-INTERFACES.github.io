class Model {
    constructor(tube) {
        this.tube = tube;

        this.score = 0;
        this.amountTube = 20;
        this.currentTube = 0;
        this.tubes = [];

        this.minTubeDistance = 30;

        this.birdMovementDif = 20;
        this.birdMovementVel = 1;

        this.tubeMovementVel = 3;
        this.lastTubeMade = 0;

        this.birdState = "alive";
        this.birdY = 200;
        this.game_width = document.querySelector(".juego").getBoundingClientRect().width;

        this.amountTubesCreated = 0;

        this.init();
    }

    init() {
        this.score = 0;
        this.currentTube = 0;
        this.restartTubes();
        this.birdState = "alive";
        bird.style.top = "200px"; 
        this.birdY = 200;
    }

    restartTubes() {
        this.tubes = [];
    }

    createTube() {

        if (this.amountTubesCreated >= this.amountTube) return;

        const gap = 200;
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

        // Guardar cantidad ANTES de filtrar
        const oldLength = this.tubes.length;

        // Borrar tubos fuera de pantalla
        this.tubes = this.tubes.filter(tube =>
            tube.getPosX() > -tube.getWidth()
        );

        // Ajustar currentTube si se borraron tubos delante de él
        const removed = oldLength - this.tubes.length;

        if (removed > 0) {
            this.currentTube = Math.max(0, this.currentTube - removed);
        }
    }





    birdUp(gameHeight) {
        const newY = this.birdY - this.birdMovementDif;

        if (newY < 0) {
            this.birdState = "dead";
        }

        this.birdY = newY;
        return this.birdY;
    }

    birdDown(gameHeight) {
        const newY = this.birdY + this.birdMovementDif;

        if (newY > gameHeight) {
            this.birdState = "dead";
        }

        this.birdY = newY;
        return this.birdY;
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

    // chequee si salio o no del juego
    checkFlappyOutGame(birdBox, gameBox) {

        // Toca el techo del juego
        if (birdBox.top <= gameBox.top) {
            this.birdState = "dead";
            this.birdY = 200;
            return true;
        }

        // Toca el piso del juego
        if (birdBox.bottom >= gameBox.bottom) {
            this.birdState = "dead";
            this.birdY = 200;
            return true;
        }

        return false;
    }

    tubePassed(bird_left) {

        const tube = this.tubes[this.currentTube];

        // Si el tubo no existe → no se hace nada
        if (!tube) return false;

        const passed = bird_left > (tube.getPosX() + tube.getWidth());

        if (passed) {
            // Sumar punto solo cuando pasa el tubo BOTTOM
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




}
