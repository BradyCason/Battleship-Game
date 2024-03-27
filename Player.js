class Player{
    constructor(enemyboard, computer = false){
        this.enemyboard = enemyboard;
    }

    attack(x, y){
        this.enemyboard.recieveAttack(x, y);
    }
}

module.exports = {Player}