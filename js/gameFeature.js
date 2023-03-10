'use strict'

const MINE = '๐ฃ'
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
    elCell.innerText = '๐ฅ'
    setTimeout(() => {
      cell.isMarked = true
      cell.isShown = true
      onMineClicked(cell)
      elCell.innerText = '๐ฃ'
      elCell.classList.remove('cell')
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
    elLives.innerText += '๐งก'
  }
  for (let i = 0; i < 3 - lives; i++) {
    elLives.innerText += '๐'
  }
}

function generateHints(hintCount) {
  gHints = hintCount
  var htmlText = ''
  for (let i = 0; i < hintCount; i++) {
    htmlText += '<button class="available" onClick="onHint(this)">๐ก</button>'
  }
  elHints.innerHTML = htmlText
}
