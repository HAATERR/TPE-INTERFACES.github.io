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
    this.types = []; // matriz paralela para el tipo de ficha (0, 1 o 2)
    this.init();
  }

  init() {
    this.board = JSON.parse(JSON.stringify(this.INITIAL)); // copio el tablero inicial

    this.types = [];
    for (let r = 0; r < this.SIZE; r++) {
      this.types[r] = [];
      for (let c = 0; c < this.SIZE; c++) {
        if (this.board[r][c] === 1) {
          this.types[r][c] = (r + c) % 3;
        } else {
          this.types[r][c] = -1;
        }
      }
    }

  }

  localizeCard(row, col) {
    return this.board[row][col];
  }

  possibleNextSteps(row, col) {
    const moves = [];
    if (this.board[row][col] !== 1) return moves;
    const dirs = [
      [-2, 0],
      [2, 0],
      [0, -2],
      [0, 2]
    ];

    for (let [dr, dc] of dirs) {
      const newRow = row + dr;
      const newCol = col + dc;
      const midRow = row + dr / 2;
      const midCol = col + dc / 2;

      if (
        newRow >= 0 && newRow < this.SIZE &&
        newCol >= 0 && newCol < this.SIZE &&
        this.board[midRow][midCol] === 1 &&
        this.board[newRow][newCol] === 0 &&
        this.board[row][col] === 1
      ) {
        moves.push({ row: newRow, col: newCol });
      }
    }
    return moves;
  }

  applyMove(from, to) {
    const dr = to.row - from.row;
    const dc = to.col - from.col;

    const esValido =
      (Math.abs(dr) === 2 && dc === 0) ||
      (Math.abs(dc) === 2 && dr === 0);

    if (!esValido) return false;

    const midRow = from.row + dr / 2;
    const midCol = from.col + dc / 2;

    if (
      this.board[from.row][from.col] === 1 &&
      this.board[midRow][midCol] === 1 &&
      this.board[to.row][to.col] === 0
    ) {
      // mover las fichas lógicamente
      this.board[from.row][from.col] = 0;
      this.board[midRow][midCol] = 0;
      this.board[to.row][to.col] = 1;

      // mover también el tipo visual
      this.types[to.row][to.col] = this.types[from.row][from.col];
      this.types[from.row][from.col] = -1;
      this.types[midRow][midCol] = -1;

      return true;
    }
    return false;
  }

  checkWin() {
    return this.board.flat().filter(v => v === 1).length === 1;
  }

  checkLost() {
    for (let r = 0; r < this.SIZE; r++) {
      for (let c = 0; c < this.SIZE; c++) {
        if (this.possibleNextSteps(r, c).length > 0) {
          return false;
        }
      }
    }
    return true;
  }

  getAmountOfCards() {
    return this.board.flat().filter(v => v === 1).length;
  }
}
