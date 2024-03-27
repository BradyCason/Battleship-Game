class Ship{
    constructor(length, squares, vert){
        this.length = length;
        this.squares = squares;
        this.hits = 0;
        this.sunk = false;
        this.vert = vert;
    }

    hit(){
        this.hits ++;
        if (this.hits >= this.length){
            this.sunk = true;
        }
        return this.sunk
    }
}

export {Ship}