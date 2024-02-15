import pika
from actions import Actions

"""
    This program was created while following along with this RabbitMQ tutorial: 
    https://www.rabbitmq.com/tutorials/tutorial-one-python.html
"""
def getCommand(hist: Actions):
    print("Opening command server")
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
    channel = connection.channel()

    channel.queue_declare(queue='command')

    def callback(ch, method, properties, body):
        print("Received. Returning the following:")
        print(body.decode())
        hist.add_action(body.decode())
        channel.close()

    channel.basic_consume(queue='command', on_message_callback=callback, auto_ack=True)

    print(' [*] Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()


def sendResponse():
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))

    channel = connection.channel()

    channel.queue_declare(queue='hello')

    channel.basic_publish(exchange='', routing_key='hello', body='Hello World!')
    print(" [x] Sent 'Hello World!'")
    connection.close()

if __name__ == "__main__":
    getCommand()