'use strict';

class View {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');

    this.PADDING = 10;
    this.CELL = (this.canvas.width - this.PADDING * 2) / 7;

    this.ficha1 = new Image();
    this.ficha1.src = "assets/btngame.png";
    this.ficha2 = new Image();
    this.ficha2.src = "assets/fichalogo.png";
    this.ficha3 = new Image();
    this.ficha3.src = "assets/logoninja.png";
  }

  renderBoard(board, dragPos = null, dragFicha = null) {
    const ctx = this.ctx;
    ctx.fillStyle = "#c3a778";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (!this.ficha1.complete || !this.ficha2.complete || !this.ficha3.complete) {
      this.ficha1.onload = () => this.renderBoard(board, dragPos, dragFicha);
      this.ficha2.onload = () => this.renderBoard(board, dragPos, dragFicha);
      this.ficha3.onload = () => this.renderBoard(board, dragPos, dragFicha);
      return;
    }
    const getFicha = (row, col) => {
      if (!this.model || !this.model.types) return this.ficha1;
      const type = this.model.types[row]?.[col] ?? 0;
      if (type === 1) return this.ficha2;
      if (type === 2) return this.ficha3;
      return this.ficha1;
    };

    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        if (board[r][c] === -1) continue;

        const cx = c * this.CELL + this.PADDING + this.CELL / 2;
        const cy = r * this.CELL + this.PADDING + this.CELL / 2;

        ctx.fillStyle = "#b58f61";
        ctx.beginPath();
        ctx.arc(cx, cy, this.CELL * 0.42, 0, Math.PI * 2);
        ctx.fill();

        if (board[r][c] === 1 && !(dragFicha && dragFicha.row === r && dragFicha.col === c)) {
          const size = this.CELL * 0.92;
          const ficha = getFicha(r, c);
          ctx.drawImage(ficha, cx - size / 2, cy - size / 2, size, size);
        }
      }
    }

    if (dragPos && dragFicha && board[dragFicha.row][dragFicha.col] === 1) {
      const size = this.CELL * 0.92;
      const ficha = getFicha(dragFicha.row, dragFicha.col);

      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const cx = dragPos.x * scaleX;
      const cy = dragPos.y * scaleY;

      ctx.globalAlpha = 0.9;
      ctx.drawImage(ficha, cx - size / 2, cy - size / 2, size, size);
      ctx.globalAlpha = 1.0;
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

  showAmountOfCards(amount) {
    const am_text = document.getElementById('amount-cards');
    am_text.innerHTML = ` ${amount}`;
  }

  changeCursor(e) {
    const canvas = this.canvas;

    switch (e.type) {
      case 'mousemove':
        canvas.style.cursor = this.grabbing ? 'grabbing' : 'pointer';
        break;

      case 'mousedown':
        canvas.style.cursor = 'grabbing';
        this.grabbing = true;
        break;

      case 'mouseup':
        canvas.style.cursor = 'pointer';
        this.grabbing = false;
        break;
    }
  }
}
