
class Controller {

    constructor(model, view) {
        this.view = view;
        this.model = model;
        this.addListeners();

        this.pause_visibility = false;
    }

    addListeners() {

        const btn_play =  document.getElementById('btn-jugar');
        btn_play.addEventListener('click', () => this.startGame());
       
        const btn_full_menu = document.getElementById('btn-pantalla-completa');
        btn_full_menu.addEventListener('click', () => this.evaluateScreenMenu());



    }

    startGame() {
        this.pause_visibility = true;
        this.view.showGame();
    }

    restartGame() {
        this.view.showRestart();
    }


  
    evaluateScreenMenu() {
        if(this.pause_visibility){
            this.view.showMenu();
        }else{
            this.view.fullScreen();
        }

        
    }

    endGame() {

    }

    handleJump() {

    }

    timerOn(timestamp) {

    }

    handleGameOver() {

    }

    handleGameWin() {

    }

    

}