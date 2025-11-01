'use strict';

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.selected = null;
    this.moves = 0;
    this.timer = 0;
    this.timerInterval = null;

    this.$timer = null;
    this.$moves = null;
    this.$status = null;
    this.$statusTitle = null;
    this.$statusSub = null;

    this.addListeners();
  }

  addListeners() {
    document.getElementById("btn-jugar").addEventListener("click", () => this.startGame());
    document.getElementById("btn-volver-menu").addEventListener("click", () => this.returnMenu());
    document.getElementById("btn-reiniciar").addEventListener("click", () => this.restartGame());
    document.getElementById("canvas").addEventListener("click", (e) => this.handleClick(e));

    // elementos HUD/Status
    this.$timer = document.getElementById("timer");
    this.$moves = document.getElementById("moves");
    this.$status = document.getElementById("game-status");
    this.$statusTitle = document.getElementById("status-title");
    this.$statusSub = document.getElementById("status-sub");

    const replayBtn = document.getElementById("status-replay");
    replayBtn.addEventListener("click", () => this.restartGame());
  }

  startGame() {
    this.model.init();
    this.view.renderBoard(this.model.board);
    this.hideStatus();

    document.getElementById("juego-logo").style.display = "none";
    document.getElementById("btn-jugar").style.display = "none";
    document.querySelector(".pegsolitaire").style.display = "flex";
    document.getElementById("btn-volver-menu").style.display = "inline-block";

    this.moves = 0;
    this.timer = 0;
    this.updateHUD();
    this.startTimer();
  }

  restartGame() {
 
    clearInterval(this.timerInterval);
    this.timer = 0;
    this.moves = 0;
    this.model.init();
    this.view.renderBoard(this.model.board);
    this.updateHUD();
    this.startTimer();
    this.hideStatus();
  }

  startTimer() {
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timer++;
      this.updateHUD();
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timerInterval);
  }

  formatTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    const mm = m < 10 ? '0' + m : '' + m;
    const ss = s < 10 ? '0' + s : '' + s;
    return `${mm}:${ss}`;
  }

  updateHUD() {
    if (this.$timer) this.$timer.textContent = this.formatTime(this.timer);
    if (this.$moves) this.$moves.textContent = this.moves;
  }

  showStatus(title, sub) {
    if (!this.$status) return;
    this.$statusTitle.textContent = title;
    this.$statusSub.textContent = sub || '';
    this.$status.classList.remove('hidden');
    this.$status.classList.add('visible');
  }

  hideStatus() {
    if (!this.$status) return;
    this.$status.classList.add('hidden');
    this.$status.classList.remove('visible');
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
          this.stopTimer();
          this.showStatus('¡Ganaste! 🎉', `Movimientos: ${this.moves} · Tiempo: ${this.formatTime(this.timer)}`);
        } else if (this.model.checkLost()) {
          this.stopTimer();
          this.showStatus('Sin más movimientos', `Intentalo otra vez. Movimientos: ${this.moves} · Tiempo: ${this.formatTime(this.timer)}`);
        }
      } else {
        this.view.renderBoard(this.model.board);
      }
      this.selected = null;
      this.updateHUD();
    }
  }

  returnMenu() {
    this.stopTimer();
    this.hideStatus();
    document.querySelector(".pegsolitaire").style.display = "none";
    document.getElementById("juego-logo").style.display = "block";
    document.getElementById("btn-jugar").style.display = "flex";
  }
}
