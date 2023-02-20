const gameboard = (() => {
  let board = [
    ["","",""],
    ["","",""],
    ["","",""]
  ]
  let turn = "X"

  const getBoard = () => board
  const getTurn = () => turn

  const isValidMove = (row, col) => {
    return (board[row][col] === "" )
  }
  
  const makeMark = (player, row, col) => {
    if (isValidMove(row, col)) { 
      board[row][col] = player.sign
      return true
    } else {
      return false
    }
  }

  const takeTurn = () => {
    if (turn == "X") { turn = "O"; console.log("Turn now O") }
    else { turn = "X", console.log("Turn now X") }
  }

  return { board, getBoard, getTurn, isValidMove, makeMark, takeTurn }
})()

const Player = (playerSign) => {
  const playersSign = playerSign
  const sign = () => playersSign

  return { sign }
}

function makeGameboard(gameboard) {
  for (let row=0; row<3; row++) {
    for (let col=0; col<3; col++){
      let cellContents = gameboard.board[row][col]
      let newCellDiv = $(`
        <div>${cellContents}</div>
      `)
      newCellDiv = setCellStyling(newCellDiv, row, col, cellContents)
      $('#board-container').append(newCellDiv)
    }
  }
}

function turnCellTo(sign, row, col) {
  const cell = $(`#${row}-${col}`)
  cell.text(sign)
  cell.addClass(`fill-${sign}`)
}

function setCellStyling(newCellDiv, row, col, cellContents) {
  newCellDiv.addClass('cell')
  if (row != 0) { newCellDiv.addClass("top-border")    }
  if (row != 2) { newCellDiv.addClass("bottom-border") }
  if (col != 0) { newCellDiv.addClass("left-border")   }
  if (col != 2) { newCellDiv.addClass("right-border")  }
  if (cellContents !== "") {
    newCellDiv.addClass(`fill-${cellContents}`)
  }
  newCellDiv.attr("id", `${row}-${col}`)
  return newCellDiv
}

function setupTurnSlider() {
  $('#display-container').addClass(`${gameboard.getTurn()}-move`)
  $('#turn-display-slider').addClass(`${gameboard.getTurn()}-shown`)
}

function switchTurnSlider() {
  $('#turn-display-slider').toggleClass('X-shown')
  $('#turn-display-slider').toggleClass('O-shown')

  $('#display-container').toggleClass('X-move')
  $('#display-container').toggleClass('O-move')
}

function setupMarkButtons() {
  $('.cell').on('click', (e) => {
    const row = e.target.id.split('-')[0]  
    const col = e.target.id.split('-')[1]
    if (gameboard.isValidMove(row, col)) {
      gameboard.makeMark(gameboard.getTurn(), row, col)
      turnCellTo(gameboard.getTurn(), row, col)
      gameboard.takeTurn()
      switchTurnSlider()
    }
  })
}

$(document).ready(function() {
  makeGameboard(gameboard)
  setupMarkButtons()
  setupTurnSlider()
})