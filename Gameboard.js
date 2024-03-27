import {Ship} from "./Ship.js";

class Gameboard{
    constructor(name){
        this.ships = [];
        this.attacks = [];
        this.name = name;
        this.enemyKnownHits = [];
    }

    placeShip(length, x, y, vert){
        // Create list of squares
        let squares = []
        for (let i = 0; i < length; i++){
            if (vert){
                squares.push([x, y + i])
            }
            else{
                squares.push([x + i, y])
            }
        }

        let squaresEmpty = true;
        squares.forEach(square => {
            if (!this.squareEmpty(square[0], square[1])){
                squaresEmpty = false;
            }
        })

        if (squaresEmpty){
            this.ships.push(new Ship(length, squares, vert))
            return true
        }
        else{
            return false
        }
    }

    placeRandomShips(){
        this.ships = []
        const shipLengths = [2, 3, 3, 4, 5]
        shipLengths.forEach(length => {
            let placed = false;
            while (!placed){
                placed = this.placeShip(length, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 2))
            }
        })
    }

    recieveAttack(x, y){
        this.attacks.push([x,y])
        let hit = false;
        let hitShip;
        let sunk = false;
        this.ships.forEach(ship => {
            ship.squares.forEach(square => {
                if (JSON.stringify([x, y]) == JSON.stringify(square)){
                    sunk = ship.hit();
                    hit = true;
                    hitShip = ship;
                    this.enemyKnownHits.push(square)
                }
            })
        })
        return [hit, hitShip, sunk]
    }

    allSunk(){
        let returnVal = true;
        this.ships.forEach(ship => {
            if (ship.hits < ship.length){
                returnVal = false;
            }
        })
        return returnVal;
    }

    squareEmpty(x, y){
        if (x > 9 || x < 0 || y > 9 || y < 0){
            return false
        }

        let empty = true;
        this.ships.forEach(ship => {
            ship.squares.forEach(square => {
                if (JSON.stringify([x,y]) == JSON.stringify(square)){
                    empty = false
                }
            })
        })
        return empty;
    }

    squareAttackable(x, y){
        let returnVal = true
        this.attacks.forEach(square => {
            if (JSON.stringify(square) == JSON.stringify([x, y])){
                returnVal = false
            }
            if (x > 9 || x < 0 || y > 9 || y < 0){
                returnVal = false
            }
        })
        return returnVal
    }

    enemyShoot(){
        let x;
        let y;
        let fired = false;
        if (this.enemyKnownHits.length > 0){
            //check if vert or hor
            let vert = false;
            let hor = false;
            if (this.enemyKnownHits.length > 1){
                vert = true;
                hor = true;
                let initX = null;
                let initY;
                this.enemyKnownHits.forEach(hitSquare => {
                    if (initX == null){
                        initX = hitSquare[0]
                        initY = hitSquare[1]
                    }
                    else{
                        if (hitSquare[0] != initX){
                            vert = false
                        }
                        if (hitSquare[1] != initY){
                            hor = false
                        }
                    }
                })
            }
            let posAttacks = []
            if (hor){
                this.enemyKnownHits.forEach(hitSquare => {
                    posAttacks.push([hitSquare[0] - 1, hitSquare[1]])
                    posAttacks.push([hitSquare[0] + 1, hitSquare[1]])
                })
            }
            else if (vert){
                this.enemyKnownHits.forEach(hitSquare => {
                    posAttacks.push([hitSquare[0], hitSquare[1] - 1])
                    posAttacks.push([hitSquare[0], hitSquare[1] + 1])
                })
            }
            else{
                this.enemyKnownHits.forEach(hitSquare => {
                    this.getSquaresAdjacent(hitSquare).forEach(adjSquare => {
                        posAttacks.push(adjSquare)
                    })
                })
            }
            
            let returnVal = null
            while (posAttacks.length > 0){
                let attackSquare = posAttacks.splice(Math.floor(Math.random() * posAttacks.length), 1)[0]
                if (this.squareAttackable(attackSquare[0], attackSquare[1])){
                    let attack = this.recieveAttack(attackSquare[0], attackSquare[1])
                    if (attack[2]){
                        this.enemyKnownHits = []
                    }
                    return [attack[0], attackSquare[0], attackSquare[1]]
                }
            }
        }

        while (!fired){
            // choose square: random until found one then in line
            x = Math.floor(Math.random() * 10)
            y = Math.floor(Math.random() * 10)
            fired = this.squareAttackable(x, y)
        }

        let attack = this.recieveAttack(x, y)
        if (attack[2]){
            this.enemyKnownHits = []
        }
        return [attack[0], x, y]
    }

    getSquaresAdjacent(square){
        return [[square[0] - 1, square[1]], [square[0] + 1, square[1]], [square[0], square[1] - 1] ,[square[0], square[1] + 1]]
    }
}

export {Gameboard}