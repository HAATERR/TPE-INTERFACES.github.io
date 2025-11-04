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
    this.view.showAmountOfCards(32);
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
    const rect = this.view.canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    const scaleX = this.view.canvas.width / rect.width;
    const scaleY = this.view.canvas.height / rect.height;

    const cx = px * scaleX;
    const cy = py * scaleY;

    const cell = this.view.CELL;
    const pad = this.view.PADDING;

    const row = Math.floor((cy - pad) / cell);
    const col = Math.floor((cx - pad) / cell);


    if (row < 0 || col < 0 || row >= this.model.SIZE || col >= this.model.SIZE) return;
    if (this.model.board[row][col] === -1) return;

    if (this.model.localizeCard(row, col) === 1) {
      this.selected = { row, col };
      const movesAvail = this.model.possibleNextSteps(row, col);
      this.view.renderBoard(this.model.board);
      this.view.highlightPiece(row, col);
      this.view.showNextSteps(movesAvail);
      return;
    }

    if (this.selected) {
      const moved = this.model.applyMove(this.selected, { row, col });
      this.view.renderBoard(this.model.board);

      if (moved) {
        this.moves++;
        this.view.showAmountOfCards(this.model.getAmountOfCards());
        if (this.model.checkWin()) {
          this.stopTimer();
          this.showStatus('¡Ganaste!',
            `Movimientos: ${this.moves} · Tiempo: ${this.formatTime(this.timer)}`);
        } else if (this.model.checkLost()) {
          this.stopTimer();
          const fichasRestantes = this.model.getAmountOfCards();
          this.showStatus(
            'Sin más movimientos',
            `Movimientos: ${this.moves} · Tiempo: ${this.formatTime(this.timer)} · Fichas Restantes: ${fichasRestantes}`
          );
          // Renderiza tablero y muestra cantidad actualizada
          this.view.renderBoard(this.model.board);
          this.view.showAmountOfCards(fichasRestantes);
        }
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
