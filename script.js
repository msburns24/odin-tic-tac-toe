const gameboard = (() => {
  let board = [
    ["","",""],
    ["","",""],
    ["","",""]
  ]
  
  const makeMark = (player, row, col) => {
    if (board[row][col] !== "") { return }
    board[row][col] = player.sign
  }

  return { makeMark }
})()

const Player = (playerSign) => {
  const playersSign = playerSign
  const sign = () => playersSign

  return { sign }
}