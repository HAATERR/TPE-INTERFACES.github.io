
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

        const btn_restart = document.getElementById('btn-restart');
        btn_restart.addEventListener('click' , () => this.restartGame());

        const btn_continue = document.getElementById('btn-continue');
        btn_continue.addEventListener('click' , () => this.continueGame());

        const close_menu = document.getElementById('close-menu');
        close_menu.addEventListener('click' , () => this.view.closeMenu());

        const continue_menu = document.getElementById('btn-continue');
        continue_menu.addEventListener('click' , () => this.continueGame());


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