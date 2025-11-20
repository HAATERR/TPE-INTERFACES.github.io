class Model {
    constructor(game_width) {

        this.game_width = game_width;

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
        this.init();
    }

    init() {
        this.score = 0;
        this.currentTube = 0;
        this.tubes = [];
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
    checkFlappyOutGame(birdBox, game_div_top, game_div_bottom){
        
    }

    checkLost() {
        return this.birdState === "dead";
    }
}
