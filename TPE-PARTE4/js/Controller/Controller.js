'use strict';

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.selected = null;
    this.moves = 0;
    this.timer = 0;
    this.timerInterval = null;

    this.dragging = false;
    this.dragFicha = null;
    this.dragOrigin = null;
    this.dragPos = null;

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

    const canvas = document.getElementById("canvas");
    canvas.addEventListener("click", (e) => this.handleClick(e));

    canvas.addEventListener("mousedown", (e) => this.onMouseDown(e));
    canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));
    canvas.addEventListener("mouseup", (e) => this.onMouseUp(e));

    canvas.addEventListener("mousemove", (e) => this.view.changeCursor(e));
    canvas.addEventListener("mousedown", (e) => this.view.changeCursor(e));
    canvas.addEventListener("mouseup", (e) => this.view.changeCursor(e));


    this.$timer = document.getElementById("timer");
    this.$moves = document.getElementById("moves");
    this.$status = document.getElementById("game-status");
    this.$statusTitle = document.getElementById("status-title");
    this.$statusSub = document.getElementById("status-sub");

    const replayBtn = document.getElementById("status-replay");
    replayBtn.addEventListener("click", () => this.restartGame());
  }

  getMouseCell(e) {
    const rect = this.view.canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    const scaleX = this.view.canvas.width / rect.width;
    const scaleY = this.view.canvas.height / rect.height;

    const cx = px * scaleX;
    const cy = py * scaleY;

    const row = Math.floor((cy - this.view.PADDING) / this.view.CELL);
    const col = Math.floor((cx - this.view.PADDING) / this.view.CELL);

    if (row < 0 || col < 0 || row >= this.model.SIZE || col >= this.model.SIZE) return null;
    if (this.model.board[row][col] === -1) return null;
    return { row, col, x: px, y: py };
  }

  // --- DRAG ---
  onMouseDown(e) {
    const cell = this.getMouseCell(e);
    if (!cell) return;

    if (this.model.localizeCard(cell.row, cell.col) === 1) {
      this.dragging = true;
      this.dragOrigin = { row: cell.row, col: cell.col };
      this.dragFicha = { row: cell.row, col: cell.col };
      this.dragPos = { x: cell.x, y: cell.y };
    }
  }

  onMouseMove(e) {
    if (!this.dragging) return;

    const rect = this.view.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.dragPos = { x, y };

    this.view.renderBoard(this.model.board, this.dragPos, this.dragFicha);
    if (this.dragOrigin) {
      const movesAvail = this.model.possibleNextSteps(this.dragOrigin.row, this.dragOrigin.col);
      this.view.highlightPiece(this.dragOrigin.row, this.dragOrigin.col);
      this.view.showNextSteps(movesAvail);
    }
  }

  onMouseUp(e) {
    if (!this.dragging) return;

    const cell = this.getMouseCell(e);
    let moved = false;

    if (cell) {
      moved = this.model.applyMove(this.dragOrigin, { row: cell.row, col: cell.col });
    }

    this.dragging = false;
    this.dragFicha = null;
    this.dragOrigin = null;
    this.dragPos = null;

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
        this.view.showAmountOfCards(fichasRestantes);
      }
    }
    this.updateHUD();
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
    const cell = this.getMouseCell(e);
    if (!cell) return;

    const row = cell.row;
    const col = cell.col;

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
