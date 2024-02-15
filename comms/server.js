const express = require("express")
const app = express()

// Change the port here
const PORT = 19931

app.use(express.json())

/*
This was created while following along with this RabbitMQ tutorial: 
    https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html
*/
function commandSphero(msg) {
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
        });
        setTimeout(function() {
            connection.close();
        }, 500);
    });
}

app.post("/command", function (req, res, next) {
    console.log("  -- req.body:", req.body)
    if (req.body &&
        req.body.command) {
        // Store data from req.body
        var command = req.body.command
        commandSphero(command)
        res.status(201).send({
            command
        })
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