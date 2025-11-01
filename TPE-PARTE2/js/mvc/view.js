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
