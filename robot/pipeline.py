import pika
from actionhistory import ActionHistory

"""
    This program was created while following along with this RabbitMQ tutorial: 
    https://www.rabbitmq.com/tutorials/tutorial-one-python.html
"""
def getCommand(hist: ActionHistory):
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

    channel.queue_declare(queue='reply')

    channel.basic_publish(exchange='', routing_key='reply', body='Finished')

    print("Response sent.")
    connection.close()

if __name__ == "__main__":
    getCommand()