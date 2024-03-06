class Tile {
    constructor(name, cost, type) {
        this._owner = 0,
        this._name = name,
        this._cost = cost,
        this._type = type
    }

    get tile() {
        return {
            "owner": this._owner,
            "name": this._name,
            "cost": this._cost
        }
    }

    set owner(owner) {
        this._owner = owner
    }

    get owner() {
        return this._owner
    }
}

class Spheropoly {
    constructor () {
        this._board = [
            new Tile("Tile 1", 50),
            new Tile("Tile 2", 75),
            new Tile("Tile 3", 100),
            new Tile("Tile 4", 125),
            new Tile("Tile 5", 150),
            new Tile("Tile 6", 175),
            new Tile("Tile 7", 200),
            new Tile("Tile 8", 225),
            new Tile("Tile 9", 250),
            new Tile("Tile 10", 275),
            new Tile("Tile 11", 300),
            new Tile("Tile 12", 400)
        ]
        this._robotPosition = 0
        this._humanPosition = 0
    }

    get board() {
        const board_tiles = []
        for (let i = 0; i < this._board.length; i++) {
            board_tiles.push(this._board[i].tile)
        }
        return {
            "board": board_tiles
        }
    }

    get positions() {
        return {
            "robot": this._robotPosition,
            "human": this._humanPosition
        }
    }

    get state() {
        return {
            board: this.board["board"],
            "robot": this._robotPosition,
            "human": this._humanPosition
        }
    }

    reset() {
        this._board = [
            new Tile("Tile 1", 50),
            new Tile("Tile 2", 75),
            new Tile("Tile 3", 100),
            new Tile("Tile 4", 125),
            new Tile("Tile 5", 150),
            new Tile("Tile 6", 175),
            new Tile("Tile 7", 200),
            new Tile("Tile 8", 225),
            new Tile("Tile 9", 250),
            new Tile("Tile 10", 275),
            new Tile("Tile 11", 300),
            new Tile("Tile 12", 400)
        ]
    }

    buy(tile) {

    }

    moveHuman(roll) {
        this._humanPositon = (this._humanPosition + roll) % 12
    }

    moveRobot(roll) {
        this._robotPosition = (this._robotPosition + roll) % 12
    }
}

module.exports = Spheropoly