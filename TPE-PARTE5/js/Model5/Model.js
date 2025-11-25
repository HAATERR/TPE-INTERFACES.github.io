class Model {
    constructor(tube, altBird, Bonus) {
        this.tube = tube;
        this.altBird = altBird;
        this.bonus = bonus;

        this.score = 0;
        this.amountTube = 20;
        this.currentTube = 0;
        this.tubes = [];
        this.altBirds = [];
        this.bonus = [];
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

        this.maxAmountBonus = 3;
        this.lastBonusMade = 0;
        this.currentBonus = 0;

        this.init();
    }

    init() {
        this.score = 0;
        this.currentTube = 0;

        this.amountTubesCreated = 0;
        this.lastTubeMade = 0;
        this.lastAltBirdMade = 0;

        this.birdState = "alive";
        this.birdY = 250;
        this.birdVelocity = 0;

        this.restartTubes(); 

    }


    restartTubes() {
        this.tubes = [];
        this.altBirds = [];
        this.bonus = [];
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

        let gapTop = 80;
        let gapBottom = game_height - 180;

        const posY = Math.floor(Math.random() * (gapBottom - gapTop)) + gapTop;

        const newAltBird = new AltBird(width, height, this.game_width, posY);
        this.altBirds.push(newAltBird);
        return newAltBird;
    }

    createBonus(game_height) {
        const height = 60;
        const width = 60;

        let gapTop = 80;
        let gapBottom = game_height - 60;
        const posY = Math.floor(Math.random() * (gapBottom - gapTop)) + gapTop;
        const newBonus = new Bonus(width, height, this.game_width, posY);
        this.bonus.push(newBonus);
        return newBonus;

    }

    updateAltBirds(timestamp) {
        const game_height = document.querySelector(".juego").getBoundingClientRect().height;

        if (timestamp - this.lastAltBirdMade > 2000) {
            this.createAltBird(game_height);
            this.lastAltBirdMade = timestamp;
        }

        this.altBirds.forEach(b => {
            b.setPosX(b.getPosX() - this.secBirdVelocity);
        });

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

    updateBonus(timestamp){
        if (timestamp - this.lastTubeMade > 1000) {
            this.createBonus();
            this.lastBonusMade = timestamp;
        }

        this.bonus.forEach(bon => {
            bon.setPosX(tube.getPosX() - this.tubeMovementVel);
        });

        const oldLength = this.bonus.length;

        this.bouns = this.bonus.filter(bon =>
            bon.getPosX() > - bon.getWidth()
        );

        const removed = oldLength - this.bonus.length;

        if (removed > 0) {
            this.currentBonus = Math.max(0, this.currentBonus - removed);
        }
    }


    gotBonus() {

    }

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
                this.updateScore(1);
            }
            this.currentTube++;
        }

        return passed;
    }

    updateScore(amount) {
        this.score += amount;
    }

    checkLost() {
        return this.birdState === "dead";
    }

    checkWin() {
        return this.score === this.amountTube;
    }

}
