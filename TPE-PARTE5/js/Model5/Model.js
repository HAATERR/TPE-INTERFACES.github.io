class Model {
    constructor(tube, altBird) {
        this.tube = tube;
        this.altBird = altBird;

        this.score = 0;
        this.amountTube = 20;
        this.currentTube = 0;
        this.tubes = [];
        this.altBirds = [];
        this.AltBirdsMade = 0;

        this.minTubeDistance = 200;

        this.birdMovementDif = 20;
        this.birdMovementVel = 1;

        this.tubeMovementVel = 3;
        this.lastTubeMade = 0;

        this.birdState = "alive";
        this.birdY = 250;
        this.game_width = document.querySelector(".juego").getBoundingClientRect().width;

        this.amountTubesCreated = 0;

        this.gravity = 0.5;
        this.jumpStrength = -8;
        this.birdVelocity = 0;
        this.secBirdVelocity = 10;

        this.init();
    }

    init() {
        // PUNTAJE / PROGRESO
        this.score = 0;
        this.currentTube = 0;

        // CONTADORES PARA CREAR COSAS
        this.amountTubesCreated = 0;
        this.lastTubeMade = 0;
        this.lastAltBirdMade = 0;

        // ESTADO DEL PÁJARO
        this.birdState = "alive";
        this.birdY = 250;
        this.birdVelocity = 0;

        // LISTAS
        this.restartTubes(); // tubes = [] y altBirds = []

        /* (ya no usa) // posición visual del pájaro
        const bird = document.getElementById("bird");
        if (bird) {
            bird.style.top = "200px";
        }*/
    }


    restartTubes() {
        this.tubes = [];
        this.altBirds = [];
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

    createAltBird(game_height) {
        const height = 100;
        const width = 100;

        // AltBird aparece entre los tubos actuales
        let gapTop = 80;
        let gapBottom = game_height - 180;

        const posY = Math.floor(Math.random() * (gapBottom - gapTop)) + gapTop;

        const newAltBird = new AltBird(width, height, this.game_width, posY);
        this.altBirds.push(newAltBird);
        return newAltBird;
    }

    updateAltBirds(timestamp) {
        const game_height = document.querySelector(".juego").getBoundingClientRect().height;

        // crear un alt bird cada 2 segundos
        if (timestamp - this.lastAltBirdMade > 2000) {
            this.createAltBird(game_height);
            this.lastAltBirdMade = timestamp;
        }

        // moverlos hacia la izquierda
        this.altBirds.forEach(b => {
            b.setPosX(b.getPosX() - this.secBirdVelocity);
        });

        // borrar los que salen de pantalla
        this.altBirds = this.altBirds.filter(b => b.getPosX() > -b.getWidth());
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

}
