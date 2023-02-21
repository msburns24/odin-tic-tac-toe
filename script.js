class Gameboard {

  // private properties
  _board = [
    ["","",""],
    ["","",""],
    ["","",""]
  ]
  _winningCases = [
    [ [0,0], [0,1], [0,2] ],
    [ [1,0], [1,1], [1,2] ],
    [ [2,0], [2,1], [2,2] ],
    [ [0,0], [1,0], [2,0] ],
    [ [0,1], [1,1], [2,1] ],
    [ [0,2], [1,2], [2,2] ],
    [ [0,0], [1,1], [2,2] ],
    [ [0,2], [1,1], [2,0] ]
  ]
  _turnQueue = ["X", "O"]
  _currentTurn = this._turnQueue[0]

  constructor() {
    this.gridElement = new GridElement(this)
  }

  get board() { 
    return this._board
  }

  get currentTurn() { 
    return this._currentTurn 
  }

  isValidMove(row, col) {
    return ( this._board[row][col] === "" )
  }
  
  makeMark(row, col) {
    if (this.isValidMove(row, col)) {
      this._board[row][col] = this._currentTurn
      return true
    } else {
      return false
    }
  }

  nextTurn() {
    if (!this.isNotWin(this._currentTurn)) {
      console.log("Winner!")
    } else {
      this._turnQueue.reverse()
      this._currentTurn = this._turnQueue[0]
    }
  }

  isNotWin(sign) {
    let playerCells = this.getPlayerCells(sign)
    let inARow, winCase

    for (let caseIndex = 0; caseIndex < this._winningCases.length; caseIndex++) {
      inARow = 0
      winCase = this._winningCases[caseIndex]

      winCase.forEach(pair => {
        const pairStr = JSON.stringify(pair)
        const playerCellsStr = JSON.stringify(playerCells)
        const valIndex = playerCellsStr.indexOf(pairStr)

        if (valIndex != -1) { inARow++ }
      })

      if (inARow == 3) { return false }
    }

    return true
  }

  getPlayerCells(sign) {
    let playerCells = []
    for (let row=0; row<3; row++) {
      for (let col=0; col<3; col++) {
        if (this._board[row][col] == sign) {
          playerCells.push( [row, col] )
        }
      }
    }

    return playerCells
  }

  arrayInArray(arrVal, arrCheck) {
    const arrValStr = JSON.stringify(arrVal)
    const arrCheckStr = JSON.stringify(arrCheck)
    const valIndex = arrCheckStr.indexOf(arrValStr)

    return ( valIndex != -1 )
  }
}


class GridElement {

  constructor(gameboard) {
    this.gameboard = gameboard
    this.createGridElement()
    this.turnSlider = new TurnSlider(this.gameboard)
  }

  createGridElement() {
    this.gridArray = []

    for (let row=0; row<3; row++) {
      this.gridArray.push([])

      for (let col=0; col<3; col++){
        let cellContents = this.gameboard.board[row][col]
        let newCellDiv = $(`<div>${cellContents}</div>`)
        newCellDiv = this.setCellStyling(newCellDiv, row, col, cellContents)

        newCellDiv.on('click', { gridEl: this, gameboard: this.gameboard }, this.cellClicked)

        this.gridArray[row].push(newCellDiv)
        $('#board-container').append(newCellDiv)
      }
    }
  }

  setCellStyling(newCellDiv, row, col, cellContents) {
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

  cellClicked(e) {
    const gameboard = e.data.gameboard
    const gridEl = e.data.gridEl

    const row = e.target.id.split('-')[0]  
    const col = e.target.id.split('-')[1]

    if (gameboard.makeMark(row, col)) {
      gridEl.turnCellTo(e.data.gameboard.currentTurn, row, col)
      gridEl.turnSlider.switchTurnSlider()
      gameboard.nextTurn()
    }
  }

  turnCellTo(sign, row, col) {
    const cell = $(`#${row}-${col}`)
    cell.text(sign)
    cell.addClass(`fill-${sign}`)
  }
}

class TurnSlider {

  constructor(gameboard) {
    this.gameboard = gameboard
    this.displayContainer = $('#display-container')
    this.turnDisplaySlider = $('#turn-display-slider')
    this.addClasses()
  }

  addClasses() {
    this.displayContainer.addClass(`${this.gameboard.currentTurn}-move`)
    this.turnDisplaySlider.addClass(`${this.gameboard.currentTurn}-shown`)
  }

  switchTurnSlider() {
    this.displayContainer.toggleClass('X-move')
    this.displayContainer.toggleClass('O-move')

    this.turnDisplaySlider.toggleClass('X-shown')
    this.turnDisplaySlider.toggleClass('O-shown')
  }
}


$(document).ready(function() {
  const gameboard = new Gameboard()
})