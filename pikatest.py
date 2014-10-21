import pika
import uuid
import logging

class SentiRpcClient(object):
    def __init__(self):
    	logging.basicConfig()
    	credentials = pika.PlainCredentials('www','www')

        self.connection = pika.BlockingConnection(pika.ConnectionParameters(
                host='anand-pc', credentials=credentials, virtual_host='/', port=5677))

        self.channel = self.connection.channel()

        result = self.channel.queue_declare(exclusive=True)
        self.callback_queue = result.method.queue

        self.channel.basic_consume(self.on_response, no_ack=True,
                                   queue=self.callback_queue)

    def on_response(self, ch, method, props, body):
        if self.corr_id == props.correlation_id:
            self.response = body

    def call(self, n):
        self.response = None
        self.corr_id = str(uuid.uuid4())
        self.channel.basic_publish(exchange='',
                                   routing_key='rpc_queue',
                                   properties=pika.BasicProperties(
                                         reply_to = self.callback_queue,
                                         correlation_id = self.corr_id,
                                         ),
                                   body=str(n.encode('ascii', 'ignore')))
        while self.response is None:
            self.connection.process_data_events()
        return (self.response)

if __name__ == '__main__':
	
	senti_rpc = SentiRpcClient()


	response = senti_rpc.call("something something")
	print response
