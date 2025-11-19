class Model {
    constructor(game_width) {

        this.game_width = game_width;

        this.score = 0;
        this.amountTube = 20;
        this.currentTube = 0;
        this.tubes = [];

        this.minTubeDistance = 30;

        this.birdMovementDif = 10;
        this.birdMovementVel = 1;

        this.tubeMovementVel = 3;
        this.lastTubeMade = 0;

        this.birdState = "alive";

        this.init();
    }

    init() {
        this.score = 0;
        this.currentTube = 0;
        this.tubes = [];

        const tube = this.createTube();

        if (tube) {
            this.tubes.push(tube);
            this.lastTubeMade = 0;
            this.moveTube(tube);
        }
    }

    createTube() {
        const margin = Math.floor(Math.random() * 10);
        const randomPosX = this.game_width + margin;

        const max_height = 80;
        const width = 40;

        const random_height = Math.floor(Math.random() * max_height);

        if ((this.newTubeMoment() || this.currentTube === 0) && 
            this.currentTube < this.amountTube) {

            return new Tube(width, random_height, randomPosX);
        }

        return null;
    }

    newTubeMoment() {
        if (this.tubes.length === 0) return true;

        const lastTube = this.tubes[this.tubes.length - 1];

        return lastTube.getPosX() < (this.game_width - this.minTubeDistance);
    }

    moveTube(tube) {
        if (!tube) return;

        const pos = tube.getPosX() - this.tubeMovementVel;

        if (!tube.outOfScreen()) 
            tube.setPosX(pos);
    }

    updateScore() {
        this.score += 1;
    }

    checkFlappyTouch() {
        return false; // por ahora
    }

    checkWin() {
        return !this.checkFlappyTouch() && this.score >= this.amountTube;
    }

    checkLost() {
        return this.checkFlappyTouch();
    }
}
