'use strict';

class View {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.CELL = 55;
    this.OFFSET = 10;
  }

  renderBoard(board) {
    const ctx = this.ctx;
    ctx.fillStyle = "#c3a778";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let x=0; x<board.length; x++) {
      for (let y=0; y<board[x].length; y++) {
        if (board[x][y] === -1) continue;
        const cx = y * this.CELL + this.OFFSET + this.CELL/2;
        const cy = x * this.CELL + this.OFFSET + this.CELL/2;

        ctx.fillStyle = "#b58f61";
        ctx.beginPath();
        ctx.arc(cx, cy, 23, 0, Math.PI*2);
        ctx.fill();

        if (board[x][y] === 1) {
          ctx.fillStyle = "#463b8c";
          ctx.beginPath();
          ctx.arc(cx, cy, 20, 0, Math.PI*2);
          ctx.fill();
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  highlightPiece(x, y) {
    this.ctx.strokeStyle = "#FFD700";
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(y*this.CELL + this.OFFSET + this.CELL/2, x*this.CELL + this.OFFSET + this.CELL/2, 24, 0, Math.PI*2);
    this.ctx.stroke();
  }

  showNextSteps(moves) {
    this.ctx.strokeStyle = "#66F5FF";
    this.ctx.lineWidth = 2;
    moves.forEach(m => {
      const cx = m.y * this.CELL + this.OFFSET + this.CELL/2;
      const cy = m.x * this.CELL + this.OFFSET + this.CELL/2;
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, 8, 0, Math.PI*2);
      this.ctx.stroke();
    });
  }
}

/*
class View {
    constructor(canvasId, canvas_w, canvas_h, duration, temp, cant_rows, cant_col) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = canvas.getContext('2d');
        this.canvas_h = canvas_h;
        this.canvas_w = canvas_w;
        this.duration = duration;
        this.temp = temp;
        this.cant_rows = cant_rows;
        this.cant_col = cant_col;
    }

    ChangeHTML() {
        const game_div = document.querySelector(".juego");
        const peg = document.querySelector(".pegsolitaire");
        const loading = document.querySelector(".loading");
        const btn_play = document.getElementById('btn-jugar');
        const game_pic = document.getElementById('juego-logo');

        if (!game_div || !peg || !loading) return;

        game_div.style.backgroundImage = "none";
        game_div.style.background =
            "radial-gradient(at center , var(--BLACK_NEUTRAL) , var(--PRIMARY-SHADOW2))";

        loading.style.display = "flex";

        game_pic.style.display = 'none';
        btn_play.style.display = 'none';

        setTimeout(() => {
            loading.style.display = "none";
            this.drawBoard();
        }, 1200);
    }

    drawBoard() {

    }

    clearBoard() {
        this.ctx.clearRect(0, 0, this.canvas_w, this.canvas_h);
    }

    drawCard(x, y, img) {
        this.ctx.fillStyle = "#ff0000";
        this.ctx.beginPath();
        this.ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.closePath();
    }

    drawNextStep(x, y) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 55, 0, Math.PI * 2);
        this.ctx.lineWidth = 6;
        this.ctx.strokeStyle = "rgba(0, 255, 0, 0.7)";
        this.ctx.stroke();
        this.ctx.closePath();
    }

    renderBoard() {

    }

    selectCard() {

    }

    moveBoardAnimation(from, to) {

    }

    playerWon() {

    }

    playerLost() {

    }

    showRestart() {

    }


    restart() {

    }

    timer_on() {
        let time_remaining = this.duration
        this.temp.style.display = 'block';
        this.temp.classList.add('timer-show');

        timerInterval = setInterval(() => {

            /*
            if (gameWon) {
                clearInterval(timerInterval);
                return;
            }
                */
/*
            time_remaining--;
            const minutos = Math.floor(tiempo / 60);
            const segundos = tiempo % 60;
            temp.innerHTML = `${minutos < 10 ? '0' + minutos : minutos}:${segundos < 10 ? '0' + segundos : segundos}`;

            /*
            if (checkWin()) {
                playerWon();
                return;
            }
                */
/*
            if (tiempo <= 10) temp.style.color = '#ce1234';
            // if (tiempo <= 0) playerLost();
        }, 1000);
    }
}

*/