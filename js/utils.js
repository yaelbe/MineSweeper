const elSmileyBtn = document.querySelector('.btnSmiley')
const elLives = document.querySelector('.lives')

function buildEmptyModel(size) {
  const board = []

  for (var i = 0; i < size; i++) {
    board.push([])

    for (var j = 0; j < size; j++) {
      board[i][j] = { isMine: false, isMarked: false, minesAround: 0, isShown: false }
    }
  }
  return board
}

function countNeighbors(rowIdx, colIdx, mat) {
  var neighborsCount = 0

  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= mat.length) continue

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (i === rowIdx && j === colIdx) continue
      if (j < 0 || j >= mat[i].length) continue
      if (mat[i][j].isMine) neighborsCount++
    }
  }
  return neighborsCount
}

function getNeighborsPosList(rowIdx, colIdx, mat) {
  const neighborsPos = []
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= mat.length) continue

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (i === rowIdx && j === colIdx) continue
      if (j < 0 || j >= mat[i].length) continue
      if (mat[i][j].isMine) continue
      neighborsPos.push({ i, j })
    }
  }
  return neighborsPos
}

function renderBoard(mat, selector) {
  var strHTML = '<table><tbody class="board">'
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < mat[0].length; j++) {
      const cell = mat[i][j]
      const className = `cell cell-${i}-${j}`
      strHTML += `<td class="${className}" onmousedown="mouseDown(event, this, ${i}, ${j})" oncontextmenu="return false;"></td>\n`
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>'

  const elContainer = document.querySelector(selector)
  elContainer.innerHTML = strHTML
}

function renderCell(pos, cell, cellView) {
  const elCell = cellView ? cellView : document.querySelector(`.cell-${pos.i}-${pos.j}`)
  var cellContent = ''

  if (cell.isMarked) {
    cellContent = '🚩'
  } else if (cell.isShown) {
    elCell.classList.remove('cell')
    cellContent = cell.minesAround > 0 ? cell.minesAround : cell.isMine ? '💥' : ''
  }
  elCell.innerText = cellContent
}

function revealBoard(mat) {
  for (let i = 0; i < mat.length; i++) {
    for (let j = 0; j < mat[i].length; j++) {
      const elCell = document.querySelector(`.cell-${i}-${j}`)
      const cell = mat[i][j]

      if (cell.isMine) {
        if (cell.isShown) {
          elCell.innerText = '💣'
          elCell.style.backgroundColor = 'red'
          elCell.classList.remove('cell')
        } else if (cell.isMarked) {
          elCell.innerText = '🚩'
        } else {
          elCell.classList.remove('cell')
          elCell.innerText = '💣'
        }
      } else {
        //CELL
        if (cell.isMarked) {
          elCell.classList.remove('cell')
          elCell.innerText = '❌'
        } else {
          renderCell({ i, j }, cell, elCell)
        }
      }
    }
  }
}

function makeLives(livesCount) {
  const lives = []
  for (let i = 0; i < livesCount; i++) {
    lives.push('🧡')
  }
  return lives
}

function renderLives(lives) {
  elLives.innerText = ''
  for (let i = 0; i < lives.length; i++) {
    elLives.innerText += lives[i]
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}
