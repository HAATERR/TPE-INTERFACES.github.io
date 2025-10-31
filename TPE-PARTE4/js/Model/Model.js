'use strict';

const Model = (() => {
  const SIZE = 7;
  let board = [];
  const INITIAL = [
    [-1,-1,1,1,1,-1,-1],
    [-1,-1,1,1,1,-1,-1],
    [ 1, 1,1,1,1, 1, 1],
    [ 1, 1,1,0,1, 1, 1],
    [ 1, 1,1,1,1, 1, 1],
    [-1,-1,1,1,1,-1,-1],
    [-1,-1,1,1,1,-1,-1]
  ];

  function init() {
    board = JSON.parse(JSON.stringify(INITIAL));
  }

  function localizeCard(x, y) {
    return board[x][y];
  }

  function possibleNextSteps(x, y) {
    const moves = [];
    if (board[x][y] !== 1) return moves;
    const dirs = [[0,2],[0,-2],[2,0],[-2,0]];
    for (let [dx, dy] of dirs) {
      const nx = x + dx, ny = y + dy;
      const mx = x + dx/2, my = y + dy/2;
      if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE) {
        if (board[mx][my] === 1 && board[nx][ny] === 0) {
          moves.push({x: nx, y: ny});
        }
      }
    }
    return moves;
  }

  function applyMove(from, to) {
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    if (board[from.x][from.y] === 1 && board[midX][midY] === 1 && board[to.x][to.y] === 0) {
      board[from.x][from.y] = 0;
      board[midX][midY] = 0;
      board[to.x][to.y] = 1;
      return true;
    }
    return false;
  }

  function stepAvailability() {
    for (let x=0; x<SIZE; x++) {
      for (let y=0; y<SIZE; y++) {
        if (possibleNextSteps(x,y).length > 0) return true;
      }
    }
    return false;
  }

  function checkWin() {
    return board.flat().filter(v => v === 1).length === 1;
  }

  function checkLost() {
    return !stepAvailability();
  }

  return { init, localizeCard, possibleNextSteps, applyMove, checkWin, checkLost, get board() { return board; } };
})();

/*
class Model {
    constructor(disp_movements) {
        this.disp_movements = disp_movements;
    }

    localizeCard(x, y) {

    }

    possibleNextSteps(x, y) {

    }

    stepAvailability() {
        return this.disp_movements <= 0;
    }

    applyMove(from, to) {

    }

    checkWin() {

    }

    checkLost() {

    }


}
*/