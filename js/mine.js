'use strict'

const MINE = '💣'
const CELL = 'cell'
var gMines
var gLives

function createMines(level, board) {
  gMines = []
  for (let i = 0; i < level.minesCount; i++) {
    const i = getRandomInt(0, level.boardSize)
    const j = getRandomInt(0, level.boardSize)
    gMines.push({ i, j })
    board[i][j].isMine = true
  }
  console.table(board)
}

function setMinesNegsCount(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      var currentCell = board[i][j]
      if (currentCell.isMine === MINE) continue
      board[i][j].minesAround = countNeighbors(i, j, board)
    }
  }
  console.table(board)
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
