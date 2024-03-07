const { Router } = require('express')

const router = Router()

module.exports = router

class Tile {
    constructor(name, cost) {
        this._owner = 0,
        this._name = name,
        this._cost = cost
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
        this._lastRoll = null
    }

    set position(pos) {
        this._position = pos
    }

    get position() {
        return this._position
    }

    get funds() {
        return this._funds
    }

    set lastRoll(roll){
        this._lastRoll = roll
    }

    get lastRoll() {
        return this._lastRoll
    }

    get info() {
        return {
            "funds": this._funds,
            "position": this._position,
            "lastRoll": this._lastRoll
        }
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
            new Tile("Go", null),
            new Tile("Tile 2", 75),
            new Tile("Tile 3", 100),
            new Tile("Tile 4", 125),
            new Tile("Tile 5", 150),
            new Tile("Jail", null),
            new Tile("Tile 7", 200),
            new Tile("Tile 8", 225),
            new Tile("Wild", null),
            new Tile("Tile 10", 275),
            new Tile("Tile 11", 300),
            new Tile("Tile 12", 400)
        ]
        this._robot = new Player("robot")
        this._human = new Player("human")
        this._auctionTile = null
        this._lastAction = "start"
    }

    reset() {
        this._board = [
            new Tile("Go", null),
            new Tile("Tile 2", 75),
            new Tile("Tile 3", 100),
            new Tile("Tile 4", 125),
            new Tile("Tile 5", 150),
            new Tile("Jail", null),
            new Tile("Tile 7", 200),
            new Tile("Tile 8", 225),
            new Tile("Wild", null),
            new Tile("Tile 10", 275),
            new Tile("Tile 11", 300),
            new Tile("Tile 12", 400)
        ]
        this._robot = new Player("robot")
        this._human = new Player("human")
        this._auctionTile = null
        this._lastAction = "start"
    }

    get board() {
        const board_tiles = {}
        for (let i = 0; i < this._board.length; i++) {
            const tile = this._board[i].tile
            board_tiles[String(i)] = this._board[i].tile

            if (i == this._human.position) {
                tile["hasHuman"] = true
            } else {
                tile["hasHuman"] = false
            }

            if (i == this._robot.position) {
                tile["hasRobot"] = true
            } else {
                tile["hasRobot"] = false
            }

            board_tiles[String(i)] = tile
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
            "lastAction": this._lastAction,
            "robot": this._robot.info,
            "human": this._human.info,
            board: this.board["board"]      
        }
    }

    set lastAction(action) {
        this._lastAction = action
    }

    // Checks if there is a tile availalbe for auction currently.
    hasAuction() {
        if (this._auctionTile) {
            return true
        } else {
            return false
        }
    }

    // Checks if the human can buy the tile they're standing on.
    canBuy() {
        if (this._human.funds >= this.board[this._human.position].cost) {
            return true
        } else {
            return false
        }
    }

    // Human player buys the tile they're standing on.
    buy() {
        this._board[this._human.position].owner = 1
        this._human.takeMoney(this._board[this._human.position].cost)
    }

    // Human player sends the tile they're standing on to auction.
    auction(){
        this._auctionTile = this._human.position
    }

    // Move the human along the board.
    moveHuman(roll) {
        this._human.position = (this._human.position + roll) % 12
        this._human.lastRoll = roll
        console.log(this._human.position)
    }

    // Move the robot along the board.
    moveRobot(roll) {
        this._robot.position = (this._robot.position + roll) % 12
    }

    // Checks if there's a property on auction for the robot to buy, and buys it if there is.
    roboAuction() {
        if (this._auctionTile) {
            if (this._robot.funds >= this.board[this._auctionTile].cost) {
                this._robot.funds -= this.board[this._auctionTile].cost
                this.board[this._auctionTile].owner = 2
                this._auctionTile = null
                return 1
            } else {
                console.log("Robot cannot afford to buy the auctioned property.")
                this._auctionTile = null
                return -1
            }
        } else {
            console.log("No auctioned property for the robot to consider.")
            return 0
        }
    }

    // Checks who owns the tile the robot is standing on, and takes action accordingly.
    roboTile() {

        switch(this._robot.position) {
            case 0:
                console.log("GO")

            default:
                const currentTile = this._board[this._robot.position]
                switch (currentTile.owner) {
                    case 0: // Owned by nobody. The robot wants to buy it.
                        if (this._robot.funds >= currentTile.cost) {
                            this._robot.takeMoney(currentTile.cost)
                            currentTile.owner = 2
                        } else {
                            console.log("Robot cannot afford to buy the property they landed on. Sending to auction.")
                            this._auctionTile = this._robot.position
                        }
                    case 1: // Owned by the player. The robot must give them money or lose.
                        if (this._robot.funds >= currentTile.cost) {
                            this._robot.takeMoney(currentTile.cost)
                            this._human.giveMoney(currentTile.cost)
                        } else {
                            console.log("The robot lost the game! TODO: Actually end the game here.")
                        }     
                    case 2:
                        console.log("The robot landed on its own tile! TODO: Communicate this to the player.")
                }
        }
        console.log(this._board[this._robot.position])
        
    }

    // The robot's turn.
    roboTurn(command, receive, complete) {
        var roll = Math.floor(Math.random() * 6)
        this._robot.lastRoll = roll
        this.moveRobot(roll)
        this.roboAuction()
        this.roboTile()
        const orders = {
            "roll": roll,
            "position": this._robot.position
        }
        command(orders, complete)
        receive(complete)
    }
}

const spheropoly = new Spheropoly()

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
        spheropoly.lastAction = "roll"
        res.status(201).send(spheropoly.state)
    } else {
        res.status(400).send({
            err: "Request needs a body with roll present."
        })
    }
})

router.post('/confirm', function(req, res, next) {
    spheropoly.lastAction = "confirm"
    res.status(201).send(spheropoly.state)
})

router.post('/buy', function(req, res, next) {
    var callbackCount = 0
    spheropoly.buy()
    spheropoly.roboTurn(req.app.get("command"), req.app.get("awaitReply"), complete)
    spheropoly.lastAction = "tile"

    function complete(msg) {
        callbackCount ++
        console.log("callback Count:", callbackCount, "msg:", msg)
        if (callbackCount >= 2) {
            res.status(201).send(spheropoly.state)
        }
    }
})

router.post('/auction', function(req, res, next){
    spheropoly.auction()
    spheropoly.roboTurn(req.app.get("command"), req.app.get("awaitReply"), complete)
    spheropoly.lastAction = "tile"
    function complete(msg) {
        callbackCount ++
        console.log("callback Count:", callbackCount, "msg:", msg)
        if (callbackCount >= 2) {
            res.status(201).send(spheropoly.state)
        }
    }
})


router.post('/new', function(req, res, next){
    spheropoly.reset()
    spheropoly.lastAction = "start"
    res.status(200).send(spheropoly.state)
})
