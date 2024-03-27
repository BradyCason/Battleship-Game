class UIController{
  constructor(playerBoard, computerBoard){
    this.createBoards();
    this.timeout = null;
    this.had3 = false;
    this.requestNum = 0;

    document.querySelector(".randomize-ships-button").addEventListener("click", () => {
      this.removeShips();
      
      playerBoard.placeRandomShips();
      this.displayShips(playerBoard)
      this.shipsMoveable(playerBoard);
    })

    // Setup clicking enemy squares
    for (let y = 0; y < 10; y++){
      for (let x = 0; x < 10; x++){
        let squareDiv = document.querySelector(".computer-board .x" + x.toString() + ".y" + y.toString())

        squareDiv.addEventListener("click", () => {
          if (squareDiv.classList.contains("clickable") && !squareDiv.classList.contains("clicked")){
            squareDiv.classList.add("clicked");

            //[hit, hitShip, sunk]
            let attack = computerBoard.recieveAttack(x, y);
            if (attack[0]){
              // hit
              squareDiv.children[0].style.display = "block"
              squareDiv.children[0].style.backgroundColor = "rgba(255,0,0,0.2)";
              squareDiv.children[0].src = "./images/x-icon.png"
              this.typeWriter("Hit!")
            }
            else{
              // miss
              squareDiv.children[0].style.display = "block"
              squareDiv.children[0].src = "./images/dot.webp";
              squareDiv.children[0].style.backgroundColor = "rgba(0,0,0,0.5)";
              this.typeWriter("Miss!")
            }

            if (attack[2]){
              // ship sunk: change color of ship... attack[1] is the hit ship.
              this.displayShip(computerBoard, attack[1])
              if (attack[1].length == 3){
                this.had3 = true;
              }
            }

            if (!this.checkGameOver(playerBoard, computerBoard)){
              this.notPlayerTurn(playerBoard, computerBoard);
            }
          }
        })
      }
  }
  }

  checkGameOver(playerBoard, computerBoard, enemyShot = null){
    if (computerBoard.allSunk()){
      this.typeWriter("Game Over! You Win!")
      return true;
    }
    else if (playerBoard.allSunk()){
      this.timeout = setTimeout(() => {
        this.typeWriter("Enemy Aiming...")
        this.timeout = setTimeout(() => {
          this.typeWriter("Enemy Firing...")
          this.timeout = setTimeout(() => {
            this.typeWriter("Hit!")
            let square = document.querySelector(".player-board .x" + enemyShot[1].toString() + ".y" + enemyShot[2].toString())
            square.children[0].style.display = "block";
            square.children[0].src = "./images/x-icon.png";
            square.children[0].style.backgroundColor = "rgba(255,0,0,0.2)";
            this.timeout = setTimeout(() => {
              this.typeWriter("Game Over! You Lose!")
            }, 1500)
          }, 1500)
        }, 1500)
      }, 1500)
      return true;
    }
  }

  removeShips(){
    let oldShips = document.querySelectorAll(".player-board .ship");
    oldShips.forEach(oldShip => {
      oldShip.remove();
    })
    oldShips = document.querySelectorAll(".computer-board .ship");
    oldShips.forEach(oldShip => {
      oldShip.remove();
    })
  }

  createBoards(){
        let playerBoard = document.querySelector(".player-board");
        let computerBoard = document.querySelector(".computer-board");
        for (let y = 0; y < 10; y++){
            for (let x = 0; x < 10; x++){
                let newPlayerSquare = document.createElement("div")
                newPlayerSquare.classList.add("player-square")
                newPlayerSquare.classList.add ("x" + x.toString());
                newPlayerSquare.classList.add("y" + y.toString());

                let squareImg = document.createElement("img")
                squareImg.classList.add("square-img")
                squareImg.src = "";
                newPlayerSquare.appendChild(squareImg);

                playerBoard.appendChild(newPlayerSquare);

                let newComputerSquare = document.createElement("div")
                newComputerSquare.classList.add("computer-square")
                newComputerSquare.classList.add("x" + x.toString());
                newComputerSquare.classList.add("y" + y.toString());

                squareImg = document.createElement("img")
                squareImg.classList.add("square-img")
                squareImg.src = "";
                newComputerSquare.appendChild(squareImg);

                computerBoard.appendChild(newComputerSquare);
            }
        }
    }

    displayShips(board){
        let had3 = false
        board.ships.forEach(ship => {
            this.displayShip(board, ship, had3);
            if (ship.length == 3){
              had3 = true;
            }
        });
    }

    displayShip(board, ship, had3 = false){
      if (ship.vert){
        let squareDiv = document.querySelector("." + board.name + "-board .x" + ship.squares[0][0].toString() + ".y" + ship.squares[0][1].toString())
        ship.div = document.createElement("div")
        ship.div.classList.add("ship")
        ship.div.style.width = "36.8px";
        ship.div.style.height = "calc(36.8px + " + ((ship.length - 1) * 40).toString() + "px)";
        
        if (had3 && ship.length == 3){
          ship.div.style.backgroundImage = "url(./images/3ship2.png)"
        }
        else{
          ship.div.style.backgroundImage = "url(./images/" + ship.length + "ship.png)"
        }

        squareDiv.appendChild(ship.div);
      }
      else{
        let squareDiv = document.querySelector("." + board.name + "-board .x" + ship.squares[0][0].toString() + ".y" + ship.squares[0][1].toString())
        ship.div = document.createElement("div")
        ship.div.classList.add("ship")
        ship.div.style.width = "calc(36.8px + " + ((ship.length - 1) * 40).toString() + "px)";
        ship.div.style.height = "36.8px";
        
        if (had3 && ship.length == 3){
          ship.div.style.backgroundImage = "url(./images/side3ship2.png)"
        }
        else{
          ship.div.style.backgroundImage = "url(./images/side" + ship.length + "ship.png)"
        }

        squareDiv.appendChild(ship.div)
      }
    }

    shipsMoveable(board){
      this.dragShips(board)
      this.nonDragClick(board)
    }

    shipsNotMoveable(board){
      board.ships.forEach(ship => {
        ship.div.style.pointerEvents = 'none';
      })
    }

    dragShips(board) {
      board.ships.forEach(ship => {
        var x = 0; var y = 0;
        let origX = ship.squares[0][0];
        let origY = ship.squares[0][1];
        interact(ship.div)
          .draggable({
            modifiers: [
              interact.modifiers.snap({
                targets: [
                  interact.snappers.grid({ x: 40, y: 40 })
                ],
                offset: 'startCoords',
              }),
              // interact.modifiers.restrict({
              //   restriction: ship.parentNode,
              //   elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
              //   endOnly: true
              // })
            ],
            inertia: true
          })
          .on('dragmove', function (event) {
            x += event.dx
            y += event.dy
            event.target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
          })
          .on('dragend', (event) => {
            let newSquares = []
            ship.squares.forEach(square => {
              newSquares.push([square[0] + x/40, square[1] + y/40])
            })

            if (this.squaresOpen(newSquares, ship.squares, board)){
              origX = origX + x/40;
              origY = origY + y/40;
              let squareDiv = document.querySelector("." + board.name + "-board .x" + (origX).toString() + ".y" + (origY).toString())
              ship.squares = newSquares;
              squareDiv.appendChild(ship.div)
            }

            event.target.style.transform = 'translate(0px, 0px)'
            x = 0;
            y = 0;
          })
      })
    }

    nonDragClick(board) {
      const delta = 6;
      let startX;
      let startY;
    
      board.ships.forEach(ship => {
        ship.div.addEventListener('mousedown', (event) => {
          startX = event.pageX;
          startY = event.pageY;
        });
        ship.div.addEventListener('mouseup', (event) => {
          const diffX = Math.abs(event.pageX - startX);
          const diffY = Math.abs(event.pageY - startY);
      
          if (diffX < delta && diffY < delta) {
            this.toggleAxis(board, ship);
          }
        });
      })
    }

    toggleAxis(board, ship){
      let newSquares = []
      for (let i = 0; i < ship.length; i++){
        if (ship.vert){
          newSquares.push([ship.squares[0][0] + i, ship.squares[0][1]])
        }
        else{
          newSquares.push([ship.squares[0][0], ship.squares[0][1] + i])
        }
      }

      if (this.squaresOpen(newSquares, ship.squares, board)){
        ship.squares = newSquares;
        if (ship.vert){
          ship.vert = false;
          ship.div.style.width = "calc(36.8px + " + ((ship.length - 1) * 40).toString() + "px)";
          ship.div.style.height = "36.8px";
          ship.div.style.backgroundImage = ship.div.style.backgroundImage.substr(0, 14) + "side" + ship.div.style.backgroundImage.substr(14,ship.div.style.backgroundImage.length - 14)
        }
        else {
          ship.vert = true;
          ship.div.style.width = "36.8px";
          ship.div.style.height = "calc(36.8px + " + ((ship.length - 1) * 40).toString() + "px)";
          ship.div.style.backgroundImage = ship.div.style.backgroundImage.substr(0, 14) + ship.div.style.backgroundImage.substr(18,ship.div.style.backgroundImage.length - 18)
        }
      }
      else {
        console.log("tried to toggle")
      }
    }

    squaresOpen(newSquares, origSquares, board){
      let open = true;
      newSquares.forEach(square => {
        board.ships.forEach(ship => {
          if (JSON.stringify(ship.squares) != JSON.stringify(origSquares)){
            ship.squares.forEach(shipSquare => {
              if (shipSquare[0] == square[0] && shipSquare[1] == square[1]){
                open = false;
              }
              if (square[0] < 0 || square[0] > 9 || square[1] < 0 || square[1] > 9){
                open = false
              }
            })
          }
        })
      })
      return open;
    }

    playerTurn(){
      this.typeWriter("Take Your Shot!")

      // allow clicking
      for (let y = 0; y < 10; y++){
          for (let x = 0; x < 10; x++){
            let squareDiv = document.querySelector(".computer-board .x" + x.toString() + ".y" + y.toString())
            squareDiv.classList.add("clickable");
          }
      }
    }

    turnOffClicking(){
      for (let y = 0; y < 10; y++){
        for (let x = 0; x < 10; x++){
          let squareDiv = document.querySelector(".computer-board .x" + x.toString() + ".y" + y.toString())
          squareDiv.classList.remove("clickable");
        }
      }
    }

    notPlayerTurn(playerBoard, computerBoard){
      this.turnOffClicking()

      let enemyShot = playerBoard.enemyShoot()
      this.gameOver = this.checkGameOver(playerBoard, computerBoard, enemyShot)

      if (!this.gameOver){
        this.timeout = setTimeout(() => {
          this.typeWriter("Enemy Aiming...")
          this.timeout = setTimeout(() => {
            this.typeWriter("Enemy Firing...")
            this.timeout = setTimeout(() => {
              if (enemyShot[0]){
                this.typeWriter("Hit!")
                let square = document.querySelector(".player-board .x" + enemyShot[1].toString() + ".y" + enemyShot[2].toString())
                square.children[0].style.display = "block";
                square.children[0].src = "./images/x-icon.png";
                square.children[0].style.backgroundColor = "rgba(255,0,0,0.2)";
              }
              else{
                this.typeWriter("Miss!")
                let square = document.querySelector(".player-board .x" + enemyShot[1].toString() + ".y" + enemyShot[2].toString())
                square.children[0].style.display = "block";
                square.children[0].src = "./images/dot.webp";
                square.children[0].style.backgroundColor = "rgba(0,0,0,0.5)";
              }
              this.timeout = setTimeout(() => {
                if (!this.gameOver){
                  this.playerTurn();
                }
              }, 1500)
            }, 1500)
          }, 1500)
        }, 1500)
      }
    }

    typeWriter(txt, i = 0, requestNum = this.requestNum + 1, newRequest=true) {
      let element = document.querySelector(".story-text")
      if (newRequest){
        this.requestNum ++;
      }
      if (this.requestNum == requestNum){
        if (i == 0){
          element.innerHTML = ""
        }
        if (i < txt.length) {
          element.innerHTML += txt.charAt(i);
          i++;
          setTimeout(() => {this.typeWriter(txt, i, requestNum, false)}, 50);
        }
      }
    }

    resetSquareColors(board){
      for (let y = 0; y < 10; y++){
        for (let x = 0; x < 10; x++){
          let squareDiv = document.querySelector("." + board.name + "-board .x" + x.toString() + ".y" + y.toString())
          squareDiv.children[0].style.display = "none"
          squareDiv.classList.remove("clicked");
        }
      }
    }
}

export {UIController}