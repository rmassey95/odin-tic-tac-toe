const gameBoard = (() => {
  let board = Array(9).fill("");

  const checkRows = () =>{
    for (let index = 0; index < board.length; index+=3) {
      if ((board[index] !== "") && (board[index] === board[index+1]) && (board[index+1] === board[index+2])){
        return true;
      }
    }
    return false;
  }

  const checkCols = () =>{
    for (let index = 0; index < 3; index++) {
      if ((board[index] !== "") && (board[index] === board[index+3]) && (board[index+3] === board[index+6])){
        return true;
      }
    }
    return false;
  }

  const checkDiagonals = () =>{
    if ((board[0] !== "") && (board[0] === board[4]) && (board[4] === board[8])){
      return true;
    } else if ((board[2] !== "") && (board[2] === board[4]) && (board[4] === board[6])){
      return true;
    } else {
      return false;
    }
  }

  const checkWin = () => {
    if (checkRows() || checkCols() || checkDiagonals()){
      return true;
    } else {
      return false;
    }
  }

  const resetBoard = () =>{
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  }

  const checkDraw = () => {
    if (board.includes('')){
      return false;
    } else {
      return true;
    }
  }

  return {board, checkWin, resetBoard, checkDraw};
})();

const Player = (m) => {
  const mark = m;
  let turn = false;
  let playerName = "";

  return {mark, turn, playerName};
};

const gameController = (() => {
  playerOne = Player("X");
  playerTwo = Player("O");
  let playMarker = "";

  const checkSpaceFree = (loc) =>{
    if (gameBoard.board[loc] == ''){
      if (playerOne.turn === playerTwo.turn){
        playerOne.turn = true;
      }
      if (playerOne.turn) {
        playMarker = playerOne.mark;
        playerOne.turn = false;
        playerTwo.turn = true;
      } else {
        playMarker = playerTwo.mark;
        playerTwo.turn = false;
        playerOne.turn = true;
      }
      gameBoard.board[loc] = playMarker;
      displayController.fillSquare(loc, playMarker);
    }
  }

  const setPlayerName = (name, player) => {
    if (player === 1) {
      playerOne.playerName = name;
    } else {
      playerTwo.playerName = name;
    }
  }

  const resetPlayerTurn = () => {
    playerOne.turn = false;
    playerTwo.turn = false;
  }; 

  const winner = () => {
    if (playMarker === "O") {
      return `${playerTwo.playerName} Wins!`;
    } else {
      return `${playerOne.playerName} Wins!`;
    }
  };

  return {checkSpaceFree, winner, resetPlayerTurn, setPlayerName};
})();

const displayController = (() => {

  const boxes = document.querySelectorAll('.clickable-box');
  const newGameBtn = document.querySelector('.new-game-btn');
  const displayWinner = document.querySelector('.winner-box');
  const names = document.querySelectorAll('input');

  for (const name of names) {
    name.addEventListener('input', (e) => {
      if (e.target.dataset.id == "p-one"){
        gameController.setPlayerName(e.target.value, 1);
      } else {
        gameController.setPlayerName(e.target.value, 2);
      }
    })
  }

  for (const box of boxes) {
    box.addEventListener('click', () =>{
      gameController.checkSpaceFree(parseInt(box.dataset.id));
      if (gameBoard.checkWin()){
        disableButtons(gameController.winner());
      } else if (gameBoard.checkDraw()){
        disableButtons("Draw!");
      }
    });
  }

  const fillSquare = (loc, mark) =>{
    boxes[loc].innerText = mark;
  }

  const disableButtons = (msg) => {

    gameController.resetPlayerTurn();

    for (const box of boxes) {
      box.disabled = true;
    }
    displayWinner.style.display = "flex";
    document.querySelector('.winner-msg').innerText = msg;
  };

  newGameBtn.addEventListener('click', () => {
    gameBoard.resetBoard();
    resetButtons();
  });

  const resetButtons = () => {
    for (const box of boxes){
      box.innerText = "";
      box.disabled = false;
    }
    displayWinner.style.display = "none";
    document.querySelector('.winner-msg').innerText = "";
  };

  return {fillSquare};

})();