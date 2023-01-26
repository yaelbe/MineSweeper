'use strict'
//ui consts
const elSmileyBtn = document.querySelector('.btnSmiley')
const elLives = document.querySelector('.lives')
const elHints = document.querySelector('.hints')
const elTime = document.querySelector('#time')
const elScore = document.querySelector('#best-score')
const elMinesCount = document.querySelector('#mines-count')

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

function resetCounters() {
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

  gMinesCountdown = gLevel.minesCount
}
