import {UIController} from "./UIController.js";
import { Gameboard } from "./Gameboard.js";

const playerBoard = new Gameboard("player");
const computerBoard = new Gameboard("computer");

let UI = new UIController(playerBoard, computerBoard);

document.querySelector(".restart-button").addEventListener("click", () => {
    resetGame();
})

document.querySelector(".play-button").addEventListener("click", () => {
    // change buttons to in game buttons
    document.querySelector(".starting-button-container").style.display = "none"
    document.querySelector(".game-button-container").style.display = "flex"

    UI.shipsNotMoveable(playerBoard);

    UI.playerTurn();
})

function resetGame(){
    UI.gameOver = true;
    clearTimeout(UI.timeout)
    UI.typeWriter("Place Your Ships!")
    UI.turnOffClicking()
    UI.removeShips();
    UI.resetSquareColors(playerBoard);
    UI.resetSquareColors(computerBoard);
    UI.had3 = false;

    playerBoard.placeRandomShips();
    computerBoard.placeRandomShips();

    UI.displayShips(playerBoard);

    UI.shipsMoveable(playerBoard);

    // change buttons to starting buttons
    document.querySelector(".starting-button-container").style.display = "flex"
    document.querySelector(".game-button-container").style.display = "none"
}

resetGame()