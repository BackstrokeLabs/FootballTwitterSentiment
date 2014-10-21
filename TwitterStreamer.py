from tweepy.streaming import StreamListener

class TwitterStreamer(StreamListener):
    """ A listener handles tweets are the received from the stream.
    This is a basic listener that just prints received tweets to stdout.

    """
    def __init__(self, queue):
        self.queue = queue
        self.count = 0

    def on_data(self, data):
        self.queue.put(data)
        self.count += 1
        #print 'Twitter Read ', self.count
        return True

    def on_error(self, status):
        print status

