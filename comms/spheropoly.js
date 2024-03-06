const { Router } = require('express')

const router = Router()

module.exports = router

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

    get cost() {
        return this._cost
    }
}

class Player {
    constructor(name) {
        this._name = name
        this._funds = 1000
        this._position = 0
    }

    set position(pos) {
        this._position = pos
    }

    get position() {
        return this._position
    }

    get info() {
        return {
            "funds": this._funds,
            "position": this._position
        }
    }

    get funds() {
        return this._funds
    }

    reset() {
        this._funds = 1000
        this._position = 0
    }

    takeMoney(transaction) {
        this._funds -= transaction
    }

    giveMoney(transaction) {
        this._funds += transaction
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

        this._robot = new Player("robot")
        this._human = new Player("human")
        this._auctionTile = null
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
            "robot": this._robot.position,
            "human": this._human.position
        }
    }

    get state() {
        return {
            "robot": this._robot.info,
            "human": this._human.info,
            board: this.board["board"]      
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
        this._human.reset()
        this._robot.reset()
    }

    hasAuctioned() {
        if (this._auctionTile) {
            return true
        } else {
            return false
        }
    }

    canBuy() {
        if (this._human.funds >= this.board[this._human.position].cost) {
            return true
        } else {
            return false
        }
    }

    buy() {
        this._board[this._human.position].owner = 1
        this._human.takeMoney(this._board[this._human.position].cost)
    }

    auction(){
        this._auctionTile = this._human.position
    }

    moveHuman(roll) {
        this._human.position = (this._human.position + roll) % 12
        console.log(this._human.position)
    }

    moveRobot(roll) {
        this._robot.position = (this._robot.position + roll) % 12
    }
}

const spheropoly = new Spheropoly()

function roboTurn(command, receive, complete) {
    command(spheropoly.state, complete)
}

router.post('/', function(req, res, next){
    console.log("  -- req.body:", req.body)
    if (req.body && req.body.command) {
            res.status(201).send({msg: "Welcome to Spheropoly!"})
    } else {
        res.status(400).send({
            err: "Request needs a body with command."
        })
    }
})

router.get('/status', function(req, res, next){
    res.status(200).send(spheropoly.state)
})

router.post('/roll', function(req, res, next){
    console.log("  -- req.body:", req.body)
    if (req.body && req.body.roll) {
        spheropoly.moveHuman(req.body.roll)
        res.status(201).send(spheropoly.state)
    } else {
        res.status(400).send({
            err: "Request needs a body with command."
        })
    }
})

router.post('/buy', function(req, res, next) {
    spheropoly.buy()
    roboTurn(req.app.get("command"), req.app.get("awaitReply"), complete)
    function complete(msg) {
        console.log(msg)
    }
    res.status(201).send(spheropoly.state)
})

router.post('/auction', function(req, res, next){

})


router.post('/new', function(req, res, next){
    spheropoly.reset()
    res.status(200).send()
})
