'use strict'

const MINE = '💣'
const CELL = 'cell'
var gMines
var gLives

function createMines(count, board) {
  gMines = [
    { i: 1, j: 1 },
    { i: 3, j: 3 },
  ]

  for (let i = 0; i < gMines.length; i++) {
    let currentMine = gMines[i]
    board[currentMine.i][currentMine.j].isMine = true
  }
}

function setMinesNegsCount(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      var currentCell = board[i][j]
      if (currentCell.type === MINE) continue
      board[i][j].minesAround = countNeighbors(i, j, board)
    }
  }
}

function handelMineClicked(elCell, cell) {
  if (gLives.length > 0) {
    gLives.pop()
    renderLives(gLives)
    elCell.innerText = '💥'
    setTimeout(() => {
      elCell.innerText = ''
    }, 500)
  } else {
    cell.isShown = true
    gameOver()
  }
}
