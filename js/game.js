'use strict'

const BRGINNER = {
  boardSize: 4,
  minesCount: 2,
}
const MEDIUM = {
  boardSize: 8,
  minesCount: 14,
}
const EXPERT = {
  boardSize: 12,
  minesCount: 32,
}

var gBoard
var gLevel = BRGINNER
const gGame = {
  isOn: false,
  markedCount: 0,
  shownCount: 0,
  secPassed: 0,
}

function onInit() {
  gGame.isOn = true
  gGame.markedCount = 0
  gGame.shownCount = 0
  gGame.secPassed = 0

  gBoard = buildBoard()
  renderBoard(gBoard, '.board-container')
  gGame.isOn = true
}

function buildBoard() {
  var board = buildEmptyModel(gLevel.boardSize)
  createMines(gLevel.minesCount, board)
  setMinesNegsCount(board)
  return board
}

function onCellClicked(elCell, i, j) {
  const currentCell = gBoard[i][j]

  if (currentCell.isMine) {
    currentCell.isShown = true
    gameOver()
    return
  }

  expandShown(i, j, gBoard)

  if (checkGameOver()) {
    console.log('You won🎉!')
  }
}

function onCellMarked(elCell, i, j) {
  const currentCell = gBoard[i][j]
  currentCell.isMarked = !currentCell.isMarked
  if (currentCell.isMarked && currentCell.isMine) gGame.markedCount++
  renderCell({ i, j }, currentCell)
}

function gameOver() {
  gGame.isOn = false
  revealBoard(gBoard)
  console.log('GameOver')
}

function checkGameOver() {
  return gGame.markedCount + gGame.shownCount == gLevel.boardSize ** 2
}

function expandShown(i, j, mat) {
  const currentCell = mat[i][j]

  if (currentCell.isMine || currentCell.isShown) return

  currentCell.isShown = true
  gGame.shownCount++

  renderCell({ i, j }, currentCell)

  if (currentCell.minesAround === 0) {
    const neighborsPos = getNeighborsPosList(i, j, mat)
    for (let i = 0; i < neighborsPos.length; i++) {
      const currenPos = neighborsPos[i]
      expandShown(currenPos.i, currenPos.j, mat)
    }
  }
}

function mouseDown(e, elCell, i, j) {
  if (!gGame.isOn) return

  e = e || window.event
  switch (e.which) {
    case 1:
      console.log('left')
      onCellClicked(elCell, i, j)
      break
    case 2:
      console.log('middle')
      break
    case 3:
      console.log('right')
      onCellMarked(elCell, i, j)
      break
  }
}
