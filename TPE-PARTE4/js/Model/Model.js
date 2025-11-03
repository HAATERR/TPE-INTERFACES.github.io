'use strict';

class Model {
  constructor() {
    this.SIZE = 7;
    this.INITIAL = [
      [-1, -1, 1, 1, 1, -1, -1],
      [-1, -1, 1, 1, 1, -1, -1],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 0, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
      [-1, -1, 1, 1, 1, -1, -1],
      [-1, -1, 1, 1, 1, -1, -1]
    ];
    this.board = [];
    this.init();
  }

  init() {
    this.board = JSON.parse(JSON.stringify(this.INITIAL));
  }

  localizeCard(x, y) { return this.board[x][y]; }

  possibleNextSteps(x, y) {
    const moves = [];
    if (this.board[x][y] !== 1) return moves;
    const dirs = [[0, 2], [0, -2], [2, 0], [-2, 0]];
    for (let [dx, dy] of dirs) {
      const nx = x + dx, ny = y + dy;
      const mx = x + dx / 2, my = y + dy / 2;
      if (nx >= 0 && nx < this.SIZE && ny >= 0 && ny < this.SIZE) {
        if (this.board[mx][my] === 1 && this.board[nx][ny] === 0)
          moves.push({ x: nx, y: ny });
      }
    }
    return moves;
  }

  applyMove(from, to) {
    const midRow = (from.row + to.row) >> 1;
    const midCol = (from.col + to.col) >> 1;

    if (
      this.board[from.row][from.col] === 1 &&
      this.board[midRow][midCol] === 1 &&
      this.board[to.row][to.col] === 0
    ) {
      this.board[from.row][from.col] = 0;
      this.board[midRow][midCol] = 0;
      this.board[to.row][to.col] = 1;
      return true;
    }
    return false;
  }


  checkWin() { return this.board.flat().filter(v => v === 1).length === 1; }

  checkLost() {
    for (let x = 0; x < this.SIZE; x++)
      for (let y = 0; y < this.SIZE; y++)
        if (this.possibleNextSteps(x, y).length > 0) return false;
    return true;
  }
}

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