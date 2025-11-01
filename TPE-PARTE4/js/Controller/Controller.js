'use strict';

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.selected = null;
    this.moves = 0;
    this.timer = 0;
    this.timerInterval = null;

    this.addListeners();
  }

  addListeners() {
    document.getElementById("btn-jugar").addEventListener("click", () => this.startGame());
    document.getElementById("btn-volver-menu").addEventListener("click", () => this.returnMenu());
    document.getElementById("canvas").addEventListener("click", (e) => this.handleClick(e));
  }

  startGame() {
    this.model.init();
    this.view.renderBoard(this.model.board);

    document.getElementById("juego-logo").style.display = "none";
    document.getElementById("btn-jugar").style.display = "none";
    document.querySelector(".pegsolitaire").style.display = "flex";
    document.getElementById("btn-volver-menu").style.display = "inline-block";

    this.moves = 0;
    this.timer = 0;
    this.startTimer();
  }

  startTimer() {
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timer++;
    }, 1000);
  }

  handleClick(e) {
    const rect = e.target.getBoundingClientRect();
    const cell = this.view.CELL;
    const x = Math.floor((e.clientY - rect.top) / cell);
    const y = Math.floor((e.clientX - rect.left) / cell);


    if (!this.selected && this.model.localizeCard(x, y) === 1) {
      this.selected = { x, y };
      const movesAvail = this.model.possibleNextSteps(x, y);
      this.view.renderBoard(this.model.board);
      this.view.highlightPiece(x, y);
      this.view.showNextSteps(movesAvail);
    } else if (this.selected) {
      if (this.model.applyMove(this.selected, { x, y })) {
        this.moves++;
        this.view.renderBoard(this.model.board);

        if (this.model.checkWin()) {
          clearInterval(this.timerInterval);
          alert(`¡Ganaste! Movimientos: ${this.moves}`);
        } else if (this.model.checkLost()) {
          clearInterval(this.timerInterval);
          alert("No hay más movimientos. Intentalo otra vez.");
        }
      } else {
        this.view.renderBoard(this.model.board);
      }
      this.selected = null;
    }
  }

  returnMenu() {
    clearInterval(this.timerInterval);
    document.querySelector(".pegsolitaire").style.display = "none";
    document.getElementById("juego-logo").style.display = "block";
    document.getElementById("btn-jugar").style.display = "flex";
  }
}

/*
class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        const btnPlay = document.getElementById('btn-jugar');
        if (btnPlay) {
            btnPlay.addEventListener('click', () => this.startGame());
        }
    }

    startGame() {
        this.view.ChangeHTML();
        this.view.drawBoard();
    }

    onSelectCard() { 

    }

} */