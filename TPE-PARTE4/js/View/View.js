'use strict';

const View = (() => {
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");
  const CELL = 55;
  const OFFSET = 10;

  function renderBoard(boardState) {
    ctx.fillStyle = "#c3a778";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let x=0; x<boardState.length; x++) {
      for (let y=0; y<boardState[x].length; y++) {
        if (boardState[x][y] === -1) continue;
        const cx = y * CELL + OFFSET + CELL/2;
        const cy = x * CELL + OFFSET + CELL/2;

        ctx.fillStyle = "#b58f61";
        ctx.beginPath();
        ctx.arc(cx, cy, 23, 0, Math.PI*2);
        ctx.fill();

        if (boardState[x][y] === 1) {
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

  function highlightPiece(x, y) {
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(y*CELL + OFFSET + CELL/2, x*CELL + OFFSET + CELL/2, 24, 0, Math.PI*2);
    ctx.stroke();
  }

  function showNextSteps(moves) {
    ctx.strokeStyle = "#66F5FF";
    ctx.lineWidth = 2;
    moves.forEach(m => {
      const cx = m.y * CELL + OFFSET + CELL/2;
      const cy = m.x * CELL + OFFSET + CELL/2;
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI*2);
      ctx.stroke();
    });
  }

  return { renderBoard, highlightPiece, showNextSteps };
})();





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