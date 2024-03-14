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

    get name() {
        return this._name
    }
}

class Player {
    constructor(name) {
        this._name = name
        this._funds = 1000
        this._position = 0
        this._lastRoll = null
        this._jailed = false
        this._properties = []
        this._propertyCount = 0
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

    set lastRoll(roll) {
        this._lastRoll = roll
    }

    get lastRoll() {
        return this._lastRoll
    }

    get info() {
        return {
            "funds": this._funds,
            "position": this._position,
            "lastRoll": this._lastRoll,
            "jailed": this._jailed
        }
    }

    get jailed() {
        return this._jailed
    }

    set jailed(status) {
        this._jailed = status
    }

    get propertyCount() {
        return this._propertyCount
    }

    addProperty(tile) {
        this._properties.push(tile)
        this._propertyCount += 1
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
    constructor() {
        this._board = [
            new Tile("Go", null),
            new Tile("Tile 1", 75),
            new Tile("Tile 2", 100),
            new Tile("Go To Jail", null),
            new Tile("Tile 4", 150),
            new Tile("Tile 5", 175),
            new Tile("Lake", null),
            new Tile("Tile 7", 225),
            new Tile("Tile 8", 250),
            new Tile("Jail", null),
            new Tile("Tile 10", 300),
            new Tile("Tile 11", 400)
        ]
        this._board[0].owner = -1
        this._board[3].owner = -1
        this._board[6].owner = -1
        this._board[9].owner = -1
        this._robot = new Player("robot")
        this._human = new Player("human")
        this._auctionTile = null
        this._lastAction = "start"
        this._summary = ""
    }

    reset() {
        this._board = [
            new Tile("Go", null),
            new Tile("Tile 1", 75),
            new Tile("Tile 2", 100),
            new Tile("Go To Jail", null),
            new Tile("Tile 4", 150),
            new Tile("Tile 5", 175),
            new Tile("Lake", null),
            new Tile("Tile 7", 225),
            new Tile("Tile 8", 250),
            new Tile("Jail", null),
            new Tile("Tile 10", 300),
            new Tile("Tile 11", 400)
        ]
        this._board[0].owner = -1
        this._board[3].owner = -1
        this._board[6].owner = -1
        this._board[9].owner = -1
        this._robot = new Player("robot")
        this._human = new Player("human")
        this._auctionTile = null
        this._lastAction = "start"
        this._summary = ""
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
            "summary": this._summary,
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
        this._human.addProperty(this._human.position)
    }

    // Human player sends the tile they're standing on to auction.
    auction() {
        this._auctionTile = this._human.position
    }

    // Human player pays rent on a tile that the Sphero owns.
    pay() {
        const transaction = this._board[this._human.position].cost
        this._human.takeMoney(transaction)
        this._robot.giveMoney(transaction)
    }

    // Move the human along the board.
    moveHuman(roll) {
        this._human.position = (this._human.position + roll) % 12
        this._human.lastRoll = roll
        console.log(this._human.position)
    }

    moveHumanToJail() {
        this._human.position = 9
        console.log(this._human.position)
    }

    // Move the robot along the board.
    moveRobot(roll) {
        this._robot.position = (this._robot.position + roll) % 12
        this._summary = this._summary + "The robot rolled a " + roll + "."
    }

    roboJailCheck() {
        if (!this._robot._jailed) {
            return true
        } else {
            if (this._robot._funds >= 200) {
                this._robot.takeMoney(200)
                this._summary = "The robot was able to bribe their way out of jail with $200."
                this._robot.jailed = false
                return true
            } else {
                if (this._robot.propertyCount == 0) {
                    this._summary = "The robot can't afford to leave jail and has no property. Game over!"
                } else {
                    this._summary = "The robot cannot afford to bribe their way out of jail and must remain."
                }
                return false
            }
        }
    }

    // Checks if there's a property on auction for the robot to buy, and buys it if there is.
    // NOTE: This function is not used in the game.
    roboAuction() {
        if (this._auctionTile) {
            if (this._robot.funds >= this.board[this._auctionTile].cost) {
                this._robot.funds -= this.board[this._auctionTile].cost
                this.board[this._auctionTile].owner = 2
                this._auctionTile = null
                this._summary = this._summary + " The robot bought the auctioned property."
                return 1
            } else {
                console.log("Robot cannot afford to buy the auctioned property.")
                this._auctionTile = null
                this._summary = this._summary + " The robot could not afford the auctioned property."
                return -1
            }
        } else {
            console.log("No auctioned property for the robot to consider.")
            return 0
        }
    }

    // Checks who owns the tile the robot is standing on, and takes action accordingly.
    roboTile() {
        switch (this._robot.position) {
            case 0:
                this._robot.giveMoney(200)
                this._summary = this._summary + "The robot landed on GO and got $200."
                break
            case 3:
                // Robot navigates to jail.
                console.log("Robot Go To Jail")
                this._robot.position = 9
                this._robot.jailed = true
                this._summary = this._summary + "The robot was caught trespassing and had to go to jail."
                break
            case 6:
                // Robot does nothing.
                this._summary = this._summary + "The robot arrived at the lake and took a moment to relax."
                break
            case 9:
                // If robot starts standing on jail, do nothing.
                // Robot jailed action is handled at the start of the turn, not here.
                this._summary = this._summary + "The robot stood outside of the jail for a while."
                break

            default:
                const currentTile = this._board[this._robot.position]
                switch (currentTile.owner) {
                    case -1: // Owned by the state. Nothing happens yet.
                        this._summary = this._summary + " The robot landed at " + currentTile.name + ", which is federal property."
                        break
                    case 0: // Owned by nobody. The robot wants to buy it.
                        if (this._robot.funds >= currentTile.cost) {
                            this._robot.takeMoney(currentTile.cost)
                            currentTile.owner = 2
                            this._robot.addProperty(this._robot.position)
                            this._summary = this._summary + " The robot bought the property it landed on."
                        } else {
                            console.log("Robot cannot afford to buy the property they landed on.")
                            this._summary = this._summary + " The robot could not afford the property it landed on, so it went back up on the market."
                        }
                        break
                    case 1: // Owned by the player. The robot must give them money or lose.
                        if (this._robot.funds >= currentTile.cost) {
                            this._robot.takeMoney(currentTile.cost)
                            this._human.giveMoney(currentTile.cost)
                            this._summary = this._summary + " The robot landed on your tile and paid you $" + currentTile.cost
                        } else {
                            console.log("The robot lost the game! TODO: Actually end the game here.")
                            this._summary = this._summary + " The robot landed on your tile and couldn't afford it. They lost."
                        }
                        break
                    case 2:
                        this._summary = this._summary + " The robot landed on their own tile."
                        break
                }
        }
        console.log(this._board[this._robot.position])

    }

    // The robot's turn.
    roboTurn(command, receive, complete) {
        var roll = (Math.floor(Math.random() * 6)) + 1
        this._summary = ""
        if (!this.roboJailCheck()) {
            complete()
            complete()
            return
        }
        console.log("Robot got a", roll)
        this._robot.lastRoll = roll
        this.moveRobot(roll)
        this.roboTile()
        const orders = {
            "roll": roll,
            "position": this._robot.position,
            "jailed": this._robot.jailed
        }
        command(orders, complete)
        receive(complete)
    }
}

const spheropoly = new Spheropoly()

router.post('/', function (req, res, next) {
    console.log("  -- req.body:", req.body)
    if (req.body && req.body.command) {
        res.status(201).send({ msg: "Welcome to Spheropoly!" })
    } else {
        res.status(400).send({
            err: "Request needs a body with command."
        })
    }
})

router.get('/status', function (req, res, next) {
    res.status(200).send(spheropoly.state)
})

router.post('/roll', function (req, res, next) {
    console.log("  -- /roll req.body:", req.body)
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

router.post('/confirm', function (req, res, next) {
    spheropoly.lastAction = "confirm"
    res.status(201).send(spheropoly.state)
})

router.post('/jail', function (req, res, next) {
    var callbackCount = 0
    console.log("  -- /jail req.body:", req.body)
    spheropoly.lastAction = "jail"
    spheropoly.moveHumanToJail()
    spheropoly.roboTurn(req.app.get("command"), req.app.get("awaitReply"), complete)
    function complete(msg) {
        callbackCount++
        console.log("callback Count:", callbackCount, "msg:", msg)
        if (callbackCount >= 2) {
            res.status(201).send(spheropoly.state)
        }
    }
})

router.post('/buy', function (req, res, next) {
    var callbackCount = 0
    spheropoly.buy()
    spheropoly.roboTurn(req.app.get("command"), req.app.get("awaitReply"), complete)
    spheropoly.lastAction = "tile"

    function complete(msg) {
        callbackCount++
        console.log("callback Count:", callbackCount, "msg:", msg)
        if (callbackCount >= 2) {
            res.status(201).send(spheropoly.state)
        }
    }
})

router.post('/auction', function (req, res, next) {
    var callbackCount = 0
    //spheropoly.auction()
    spheropoly.roboTurn(req.app.get("command"), req.app.get("awaitReply"), complete)
    spheropoly.lastAction = "tile"
    function complete(msg) {
        callbackCount++
        console.log("callback Count:", callbackCount, "msg:", msg)
        if (callbackCount >= 2) {
            res.status(201).send(spheropoly.state)
        }
    }
})

router.post('/pay', function (req, res, next) {
    var callbackCount = 0
    spheropoly.pay()
    spheropoly.roboTurn(req.app.get("command"), req.app.get("awaitReply"), complete)
    spheropoly.lastAction = "tile"
    function complete(msg) {
        callbackCount++
        console.log("callback Count:", callbackCount, "msg:", msg)
        if (callbackCount >= 2) {
            res.status(201).send(spheropoly.state)
        }
    }
})

router.post('/continue', function (req, res, next) {
    console.log("Calling continue")
    var callbackCount = 0
    spheropoly.roboTurn(req.app.get("command"), req.app.get("awaitReply"), complete)
    spheropoly.lastAction = "tile"
    function complete(msg) {
        callbackCount++
        console.log("callback Count:", callbackCount, "msg:", msg)
        if (callbackCount >= 2) {
            res.status(201).send(spheropoly.state)
        }
    }
})

router.get('/clear', function (req, res, next) {
    console.log("Calling continue")
    function clear(receive, complete) {
        receive(complete)
    }
    clear(req.app.get("awaitReply"), complete)
    function complete(msg) {
        callbackCount++
        console.log("callback Count:", callbackCount, "msg:", msg)
        if (callbackCount >= 1) {
            res.status(201).send({ "msg": msg })
        }
    }
})


router.post('/new', function (req, res, next) {
    spheropoly.reset()
    spheropoly.lastAction = "start"
    res.status(200).send(spheropoly.state)
})
