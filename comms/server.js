const express = require("express")
const app = express()

const spheropoly = require('./spheropoly')

/*
    This was created while following along with this RabbitMQ tutorial: 
    https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html
*/

// Cors is 100% necessary to get localhost to communicate with this server.
// Source: https://stackoverflow.com/questions/43150051/how-to-enable-cors-nodejs-with-express
const cors = require('cors');

// Change the port here
const PORT = 19931

app.use(express.json())

app.use(cors())

app.use('/spheropoly', spheropoly)

function commandSphero(msg, complete) {
    var amqp = require('amqplib/callback_api');
    amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            var query_queue = 'command';

            channel.assertQueue(query_queue, {
                durable: false
            });

            channel.sendToQueue(query_queue, Buffer.from(msg));

            console.log(" [x] Sent %s", msg);
            complete("AB")
        });
        setTimeout(function() {
            connection.close();
        }, 500);
    });
}

function sendJSON(msg, complete) {
    var amqp = require('amqplib/callback_api');
    amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            var query_queue = 'command';

            channel.assertQueue(query_queue, {
                durable: false
            });

            channel.sendToQueue(query_queue, Buffer.from(JSON.stringify(msg)));

            console.log(" [x] Sent %s", msg);
            complete("JSON Sent.")
        });
        setTimeout(function() {
            connection.close();
        }, 500);
    });
}

function awaitReply(complete) {
    console.log("entering function")
    var amqp = require('amqplib/callback_api');

    amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            var response_queue = 'reply';

            channel.assertQueue(response_queue, {
                durable: false
            });

            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", response_queue);

            channel.consume(response_queue, function(msg) {
                var contents = msg.content.toString()
                console.log(typeof contents)
                console.log("Received completion confirmation from Sphero: " + contents)
                connection.close()
                complete(contents);
            }, {
                noAck: true
            });
        });
    });
}

app.set("command", sendJSON)
app.set("awaitReply", awaitReply)

/*
Command function for Sphero Simon
*/
app.post("/command", function (req, res, next) {
    var callbackCount = 0
    console.log("  -- req.body:", req.body)
    if (req.body &&
        req.body.command) {
        // Store data from req.body
        var command = req.body.command
        commandSphero(command, complete)
        awaitReply(complete)
        function complete(msg){
            callbackCount++;
            console.log(callbackCount)
            if (callbackCount >= 2) {
                console.log("Sending reply back to caller: " + msg)
                res.status(201).send({
                    reply: msg
                })
            }
        }     
    } else {
        res.status(400).send({
            err: "Request needs a body with command."
        })
    }
})


/*
 * Generic 404 message for nonexistant pages
 */
app.use("*", function (req, res, next) {
    console.log("We got a 404 somehow")
    res.status(404).send({
        err: `Requested URL doesn't exist: ${req.originalUrl}`
    })
})

/*
 * Server is listening
 */
app.listen(PORT, function () {
    console.log("== Server is listening on port", PORT)
})