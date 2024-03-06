const { Router } = require('express')

const router = Router()

module.exports = router

function checkOwner() {

}

class Tile {
    constructor(name, cost, type) {
        this.owner = 0,
        this.name = name,
        this.cost = cost,
        this.type = type
    }

    get tile() {
        return {
            "owner": this.owner,
            "name": this.name,
            "cost": this.cost
        }
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
        this._robot_position = 0
        this._human_position = 0
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
            "robot": this._robot_position,
            "human": this._human_position
        }
    }
}

const spheropoly = new Spheropoly()

router.post('/new', function(req, res, next){
    res.status(200).send()
})

router.post('/', function(req, res, next){
    console.log("  -- req.body:", req.body)
    if (req.body &&
        req.body.command) {
            res.status(201).send(spheropoly.board)
    } else {
        res.status(400).send({
            err: "Request needs a body with command."
        })
    }
})