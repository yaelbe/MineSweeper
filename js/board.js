'use strict'

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

function setMinesNegsCount(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      var currentCell = board[i][j]
      if (currentCell.isMine === MINE) continue
      board[i][j].minesAround = countNeighbors(i, j, board)
    }
  }
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

function getNeighborsPosList(rowIdx, colIdx, mat, includeMines = false) {
  const neighborsPos = []
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= mat.length) continue

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= mat[i].length) continue
      if (!includeMines && mat[i][j].isMine) continue
      neighborsPos.push({ i, j })
    }
  }
  return neighborsPos
}

function getAreaPosList(posStart, posEnd, mat, includeMines = false) {
  const neighborsPos = []
  for (var i = posStart.i; i <= posEnd.i; i++) {
    if (i < 0 || i >= mat.length) continue

    for (var j = posStart.j; j <= posEnd.j; j++) {
      if (j < 0 || j >= mat[i].length) continue
      if (!includeMines && mat[i][j].isMine) continue
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
      strHTML += `<td class="${className}" onClick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(event,${i},${j})"></td>\n`
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>'

  const elContainer = document.querySelector(selector)
  elContainer.innerHTML = strHTML
  document.querySelector('.board').style.cursor = 'pointer'
}

function renderCell(pos, cell, cellView) {
  const elCell = cellView ? cellView : document.querySelector(`.cell-${pos.i}-${pos.j}`)
  var cellContent = ''

  if (cell.isMarked) {
    cellContent = '🚩'
    elCell.classList.add('cell')
  } else if (cell.isShown) {
    elCell.classList.remove('cell')
    cellContent = cell.minesAround > 0 ? cell.minesAround : cell.isMine ? '💥' : ''
  } else {
    elCell.classList.add('cell')
    elCell.innerText = ''
  }
  elCell.innerText = cellContent
}

function revealArea(neighborsPos, mat, hint, interval = 1000) {
  for (let i = 0; i < neighborsPos.length; i++) {
    const pos = neighborsPos[i]
    const cell = mat[pos.i][pos.j]
    const elCell = document.querySelector(`.cell-${pos.i}-${pos.j}`)
    elCell.classList.remove('cell')
    elCell.innerText = cell.isMine ? '💣' : cell.minesAround > 0 ? cell.minesAround : ''
  }
  setTimeout(() => {
    gGame.isOn = true
    hint.isOn = false

    for (let i = 0; i < neighborsPos.length; i++) {
      const pos = neighborsPos[i]
      renderCell(pos, mat[pos.i][pos.j])
    }
  }, interval)
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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}
