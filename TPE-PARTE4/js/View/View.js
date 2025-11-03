'use strict';

class View {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');

    this.PADDING = 10;
    this.CELL = (this.canvas.width - this.PADDING * 2) / 7;

    this.ficha1 = new Image();
    this.ficha1.src = "assets/btngame.png"; // ficha joystick
    this.ficha2 = new Image();
    this.ficha2.src = "assets/fichalogo.png"; // ficha fondo
  }

  renderBoard(board) {
    const ctx = this.ctx;
    ctx.fillStyle = "#c3a778";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (!this.ficha1.complete || !this.ficha2.complete) {
      this.ficha1.onload = () => this.renderBoard(board);
      this.ficha2.onload = () => this.renderBoard(board);
      return;
    }

    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        if (board[r][c] === -1) continue;

        const cx = c * this.CELL + this.PADDING + this.CELL / 2;
        const cy = r * this.CELL + this.PADDING + this.CELL / 2;

        // fondo 
        ctx.fillStyle = "#b58f61";
        ctx.beginPath();
        ctx.arc(cx, cy, this.CELL * 0.42, 0, Math.PI * 2);
        ctx.fill();

        // ficha
        if (board[r][c] === 1) {
          const size = this.CELL * 0.92;
          const ficha = (r + c) % 2 === 0 ? this.ficha1 : this.ficha2;

          ctx.drawImage(ficha, cx - size / 2, cy - size / 2, size, size);
        }
      }
    }
  }


  highlightPiece(row, col) {
    const cx = col * this.CELL + this.PADDING + this.CELL / 2;
    const cy = row * this.CELL + this.PADDING + this.CELL / 2;
    this.ctx.strokeStyle = "#FFD700";
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, this.CELL * 0.45, 0, Math.PI * 2);
    this.ctx.stroke();
  }

  showNextSteps(moves) {
    this.ctx.strokeStyle = "#66F5FF";
    this.ctx.lineWidth = 2;
    moves.forEach(m => {
      const cx = m.col * this.CELL + this.PADDING + this.CELL / 2;
      const cy = m.row * this.CELL + this.PADDING + this.CELL / 2;
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, this.CELL * 0.15, 0, Math.PI * 2);
      this.ctx.stroke();
    });
  }

  showAmountOfCards(amount){
    const am_text = document.getElementById('amount-cards');
    am_text.innerHTML = ` ${amount}`;
  }
}
