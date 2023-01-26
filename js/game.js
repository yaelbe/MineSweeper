'use strict'

var gHints
var gBoard
var gTimer

var gLevel = BEGINNER
var gMinesCountdown = 0

function onInit() {
  resetCounters()
  gBoard = buildBoard()
  renderBoard(gBoard, '.board-container')

  generateLives(3)
  generateHints(gHint.hintsAmount)

  stopTimer()

  setBestScores()

  //DOM
  elSmileyBtn.innerText = '😃'
  elTime.innerText = '000'
  elMinesCount.innerText = gMinesCountdown
  document.querySelector('.mega-hint').disabled = false
}

function buildBoard() {
  var board = buildEmptyModel(gLevel.boardSize)
  createMines(gLevel, board)
  setMinesNegsCount(board)
  return board
}

//Game end
function gameOver() {
  stopTimer()
  gGame.isOn = false
  elSmileyBtn.innerText = '🤯'
  revealBoard(gBoard)
}

function checkGameOver() {
  const won = gGame.markedCount + gGame.shownCount === gLevel.boardSize ** 2
  if (won) {
    stopTimer()
    gGame.isOn = false
    elSmileyBtn.innerText = '😎'
    setBestScores()
  }
}

//Score
function setBestScores() {
  var score = window.localStorage.getItem(gLevel.name)
  var levelBestTime = score ? score : Infinity
  if (gGame.secPassed && gGame.secPassed < levelBestTime) {
    window.localStorage.setItem(gLevel.name, gGame.secPassed)
    score = gGame.secPassed
  }
  elScore.innerText = score
}

//Mouse Events
function onCellClicked(elCell, i, j) {
  if (!gGame.isOn) return

  const currentCell = gBoard[i][j]
  if (currentCell.isMarked) return

  if (!gTimer) startTimer()

  if (gHint.isOn) handleHintClicked(i, j)
  else if (gMegaHint.isOn) handleMegaHintClicked(i, j)
  else if (currentCell.isMine) handelMineClicked(elCell, currentCell)
  else {
    expandShown(i, j, gBoard)
    checkGameOver()
  }
}

function onCellMarked(e, i, j) {
  e.preventDefault()

  if (!gGame.isOn) return

  const currentCell = gBoard[i][j]
  currentCell.isMarked = !currentCell.isMarked
  onMineClicked(currentCell)

  renderCell({ i, j }, currentCell)

  checkGameOver()
}

function onMineClicked(cell) {
  if (cell.isMarked && cell.isMine) gGame.markedCount++
  cell.isMarked ? gMinesCountdown-- : gMinesCountdown++
  elMinesCount.innerText = gMinesCountdown
}

//Level
function setLevel(level) {
  gLevel = level
  onInit()
}

//Hints
function onHint(elHint) {
  if (gHint.isOn || gHint.used === gHint.hintsAmount) return
  if (elHint.classList.contains('available')) {
    elHint.classList.remove('available')
    gHint.isOn = true
    gHint.used++
  }
}

function onMegaHint(elBtn) {
  if (gMegaHint.isEnable && !gHint.isOn) {
    gMegaHint.isOn = true
    gMegaHint.isEnable = false
    elBtn.disabled = true
  }
}

function handleHintClicked(i, j) {
  gGame.isOn = false
  const neighborsPos = getNeighborsPosList(i, j, gBoard, true)
  revealArea(neighborsPos, gBoard, gHint)
}

function handleMegaHintClicked(i, j) {
  if (!gMegaHint.posStart) {
    gMegaHint.posStart = { i, j }
  } else {
    gMegaHint.posEnd = { i, j }
    gGame.isOn = false
    const neighborsPos = getAreaPosList(gMegaHint.posStart, gMegaHint.posEnd, gBoard, true)
    revealArea(neighborsPos, gBoard, gMegaHint, 2000)
  }
}

//Timer
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

function stopTimer() {
  clearInterval(gTimer)
  gTimer = 0
}
