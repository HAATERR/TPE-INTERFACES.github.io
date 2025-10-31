'use strict';

const Controller = (() => {
  let selected = null;
  let moves = 0;
  let timer = 0;
  let timerInterval = null;

  function addListeners() {
    document.getElementById("btn-jugar").addEventListener("click", startGame);
    document.getElementById("btn-volver-menu").addEventListener("click", returnMenu);
    document.getElementById("game-canvas").addEventListener("click", handleClick);
  }

  function startGame() {
    Model.init();
    View.renderBoard(Model.board);

    document.getElementById("juego-logo").style.display = "none";
    document.getElementById("btn-jugar").style.display = "none";
    document.getElementById("game-container").style.display = "flex";
    document.getElementById("btn-volver-menu").style.display = "inline-block";

    moves = 0;
    timer = 0;
    updateHUD();
    startTimer();
  }

  function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timer++;
      updateHUD();
    }, 1000);
  }

  function updateHUD() {
    document.getElementById("moves").textContent = `♟ Movimientos: ${moves}`;
    document.getElementById("timer").textContent = `⏱ Tiempo: ${formatTime(timer)}`;
  }

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2,"0")}:${sec.toString().padStart(2,"0")}`;
  }

  function handleClick(e) {
    const rect = e.target.getBoundingClientRect();
    const x = Math.floor((e.clientY - rect.top) / 55);
    const y = Math.floor((e.clientX - rect.left) / 55);

    if (!selected && Model.localizeCard(x, y) === 1) {
      selected = { x, y };
      const movesAvail = Model.possibleNextSteps(x, y);
      View.renderBoard(Model.board);
      View.highlightPiece(x, y);
      View.showNextSteps(movesAvail);
    } else if (selected) {
      if (Model.applyMove(selected, { x, y })) {
        moves++;
        View.renderBoard(Model.board);
        updateHUD();

        if (Model.checkWin()) {
          clearInterval(timerInterval);
          alert(`🏆 ¡Ganaste! Movimientos: ${moves}, Tiempo: ${formatTime(timer)}`);
        } else if (Model.checkLost()) {
          clearInterval(timerInterval);
          alert("😢 No hay más movimientos. Intentalo otra vez.");
        }
      } else {
        View.renderBoard(Model.board);
      }
      selected = null;
    }
  }

  function returnMenu() {
    clearInterval(timerInterval);
    document.getElementById("game-container").style.display = "none";
    document.getElementById("btn-volver-menu").style.display = "none";
    document.getElementById("juego-logo").style.display = "block";
    document.getElementById("btn-jugar").style.display = "flex";
  }

  return { addListeners };
})();

window.addEventListener("DOMContentLoaded", Controller.addListeners);


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