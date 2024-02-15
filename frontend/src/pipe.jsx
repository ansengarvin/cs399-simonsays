import * as amqp from 'amqplib/callback_api'
import {Buffer} from 'buffer'

export function commandSphero() {
    amqp.connect('amqp://localhost:8000', function(error0, connection){
        if(error0){
            console.log(error0)
        }

        connection.createChannel(function(error1, channel) {
            if (error1) {
                console.log(error1)
            }
            var query_queue = 'query'
            var msg = "Hello"
        })

        channel.assertQueue(query_queue, {
            durable: false
        })

        channel.sendToQueue(query_queue, Buffer.from(msg));
        console.log("Sent command")
    });
    setTimeout(function () {
        connection.close();
    }, 500)
}

export function listenForSphero(complete) {
    amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            var response_queue = 'response';

            channel.assertQueue(response_queue, {
                durable: false
            });

            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", response_queue);

            channel.consume(response_queue, function(msg) {
                console.log(" [x] Received %s");
                var contents = JSON.parse(msg.content);
                var content_string = JSON.stringify(contents, null, 4)
                console.log(contents)
                
                var fs = require('fs');
                fs.writeFile('./public/temp/temp_language.json', content_string, function(err) {

                    if (err) {
                        return console.log(err);
                    };
                    console.log("File saved successfully.");
                });
                connection.close();
                complete();
            }, {
                noAck: true
            });
        });
    });
}