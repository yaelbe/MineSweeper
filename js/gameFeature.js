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
}

function handelMineClicked(elCell, cell) {
  if (gLives > 0) {
    gLives--
    renderLives(gLives)
    elCell.innerText = '💥'
    setTimeout(() => {
      cell.isMarked = true
      onMineClicked(cell)
      elCell.innerText = '🚩'
    }, 500)
  } else {
    cell.isShown = true
    gameOver()
  }
}

function generateLives(livesCount) {
  gLives = livesCount
  renderLives(livesCount)
}

function renderLives(lives) {
  elLives.innerText = ' '
  for (let i = 0; i < lives; i++) {
    elLives.innerText += '🧡'
  }
}

function generateHints(hintCount) {
  gHints = hintCount
  var htmlText = ''
  for (let i = 0; i < hintCount; i++) {
    htmlText += '<button class="available" onClick="onHint(this)">💡</button>'
  }
  elHints.innerHTML = htmlText
}
