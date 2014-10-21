from tweepy import OAuthHandler
from tweepy import Stream
from TwitterStreamer import TwitterStreamer

import threading

class TwitterListener:
    consumer_key="QEN0pRUDWBwz3eAnRGt4oA"
    consumer_secret="uPKpmdkUyEtHHYTG81hxrDe2kPybRZq8zfAnAvdrA"
    access_token="109282672-lsdLzFwO2ybQ8f00qZG51JTcel7zTghEBa00R24c"
    access_token_secret="TE717i4SK6uuHUBmak8UXLaUijNH2uV1H5HbrCSnG5c"
    
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)

    def __init__(self, queue):
         self.queue = queue
         self.threads = []

    def listen(self, tags):
         thread = threading.Thread(target=self.__listen_as_thread, args=(tags))
         thread.daemon = True
         self.threads.append(thread)
         thread.start()

    def __listen_as_thread(self, tags):
         listener = TwitterStreamer(self.queue)
         stream = Stream(TwitterListener.auth, listener)
         stream.filter(track=tags)
    

    