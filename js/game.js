'use strict'

const BEGINNER = {
  boardSize: 4,
  minesCount: 2,
  name: 'beginner',
}
const MEDIUM = {
  boardSize: 8,
  minesCount: 14,
  name: 'medium',
}
const EXPERT = {
  boardSize: 12,
  minesCount: 32,
  name: 'expert',
}

var gHints
var gBoard
var gTimer

var gLevel = BEGINNER
const gGame = {
  isOn: false,
  markedCount: 0,
  shownCount: 0,
  secPassed: 0,
}
const gHint = {
  hintsAmount: 3,
  isOn: false,
  isEnable: true,
  used: 0,
}
const gMegaHint = {
  isEnable: true,
  isOn: false,
  posStart: null,
  posEnd: null,
}

function onInit() {
  gGame.isOn = true
  gGame.markedCount = 0
  gGame.shownCount = 0
  gGame.secPassed = 0

  gHint.isEnable = true
  gHint.isOn = false
  gHint.used = 0

  gMegaHint.isEnable = true
  gMegaHint.isOn = false
  gMegaHint.posStart = null
  gMegaHint.posEnd = null

  gBoard = buildBoard()
  renderBoard(gBoard, '.board-container')
  gGame.isOn = true

  generateLives(3)
  generateHints(gHint.hintsAmount)

  clearInterval(gTimer)
  gTimer = 0

  elSmileyBtn.innerText = '😃'
  elTime.innerText = '000'
}

function buildBoard() {
  var board = buildEmptyModel(gLevel.boardSize)
  createMines(gLevel, board)
  setMinesNegsCount(board)
  return board
}

function onCellClicked(elCell, i, j) {
  const currentCell = gBoard[i][j]
  if (currentCell.isMarked) return

  if (!gTimer) {
    startTimer()
  }

  if (gHint.isOn) {
    handelHintClicked(i, j)
    return
  }
  if (gMegaHint.isOn) {
    if (!gMegaHint.posStart) {
      gMegaHint.posStart = { i, j }
    } else {
      gMegaHint.posEnd = { i, j }
      handelMegaHintClicked(gMegaHint.posStart, gMegaHint.posEnd)
    }
    return
  }

  if (currentCell.isMine) {
    handelMineClicked(elCell, currentCell)
    return
  }

  expandShown(i, j, gBoard)

  checkGameOver()
}

function onCellMarked(elCell, i, j) {
  const currentCell = gBoard[i][j]
  currentCell.isMarked = !currentCell.isMarked

  if (currentCell.isMarked && currentCell.isMine) gGame.markedCount++

  renderCell({ i, j }, currentCell)

  checkGameOver()
}

function gameOver() {
  clearInterval(gTimer)
  gTimer = 0
  gGame.isOn = false
  elSmileyBtn.innerText = '🤯'
  revealBoard(gBoard)
  console.log('GameOver')
}

function newGame() {
  onInit()
}

function checkGameOver() {
  const won = gGame.markedCount + gGame.shownCount === gLevel.boardSize ** 2
  if (won) {
    clearInterval(gTimer)
    gTimer = 0
    console.log('You won🎉!')
    gGame.isOn = false
    elSmileyBtn.innerText = '😎'

    var score = window.localStorage.getItem(gLevel.name)
    var levelBestTime = score ? score : Infinity
    if (gGame.secPassed < levelBestTime) {
      window.localStorage.setItem(gLevel.name, gGame.secPassed)
      elScore.innerText = gGame.secPassed
    }
  }
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

function setLevel(level) {
  gLevel = level
  onInit()
}

function onHint(elHint) {
  if (gHint.isOn || gHint.used === gHint.hintsAmount) return
  if (elHint.classList.contains('available')) {
    elHint.classList.remove('available')
    gHint.isOn = true
    gHint.used++
  }
}

function onMegaHint() {
  if (gMegaHint.isEnable && !gHint.isOn) {
    gMegaHint.isOn = true
    gMegaHint.isEnable = false
  }
}

function handelHintClicked(i, j) {
  gGame.isOn = false
  const neighborsPos = getNeighborsPosList(i, j, gBoard, true)
  revealArea(neighborsPos, gBoard, gHint)
}

function handelMegaHintClicked(posStart, posEnd) {
  gGame.isOn = false
  const neighborsPos = getAreaPosList(posStart, posEnd, gBoard, true)
  revealArea(neighborsPos, gBoard, gMegaHint, 2000)
}

function startTimer() {
  gTimer = setInterval(() => {
    gGame.secPassed++

    const text = gGame.secPassed

    if (gGame.secPassed < 10) {
      elTime.innerText = '00' + gGame.secPassed
    } else if (gGame.secPassed < 100) {
      elTime.innerText = '0' + gGame.secPassed
    } else {
      elTime.innerText = '' + gGame.secPassed
    }
  }, 1000)
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
