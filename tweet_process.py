import threading 
import ast
import json
import time
import pymongo
import time
import random
from threading import Thread
from Queue import Queue
from TwitterListener import TwitterListener
from pikatest import SentiRpcClient


class tweet_pr:

  def __init__(self):
    tweets_queue = Queue()

    self.game_dict={'positive_count':0,'negative_count':0,'count':0}
    self.game_dict_count = 0

    self.team_dict={'teamportugal_dict':{'name':'name1','positive_count':0,'negative_count':0},
                'teamfrance_dict':{'name':'name2','positive_count':0,'negative_count':0}

                }
    self.player_dict={'playerronaldo_dict':{'name':'ronaldo','positive_count':0,'negative_count':0},
                'playerbenzema_dict':{'name':'Benzema','positive_count':0,'negative_count':0},
                'playerPogba_dict':{'name':'Pogba','positive_count':0,'negative_count':0}, 
                  }
    self.player_names_dict={ 'ronaldo':['ronaldo','cr7','cristiano'],
                        'benzema':['Benzema','benzema','Karim Benzema'],
                        'Pogba':['Paul Pogba','Paul','Pogba']
                        }
    self.team_names_dict={ 'portugal':['portugal','portuga','portu'],
                        'france':['france','france','blues']

                        }


    self.verified_dict={}
    thread = None
    #senti_rpc = ''
    self.senti_rpc = SentiRpcClient()

  def get_senti_value(self, tweet):
    # result = random.randint(0,1)
    # if result == 1:
    #   result = 4
    result = self.senti_rpc.call(tweet)
    print result
    if result.split(',')[0] == 'positive':
      result = 4
    else:
      if float(result.split(',')[1]) < 1e-04:
        result = 4
      else:
        result = 0
    return result
    
  def process_game_dict(self, tweet,result):
    #global self.game_dict_count
    self.game_dict_count += 1
    self.game_dict['count']=self.game_dict_count
    if result == 4:
      self.game_dict['positive_count']= self.game_dict['positive_count']+1;  
    else:
      self.game_dict['negative_count']= self.game_dict['negative_count']+1; 
    
    return self.game_dict

    
  def process_player_dict(self, tweet, result):
    for player_name in self.player_names_dict:
      print player_name
      if any(nick_name in tweet for nick_name in self.player_names_dict[player_name]):
        dict_name = "player"+player_name+"_dict"
        if result == 4:
          self.player_dict[dict_name]['positive_count']= self.player_dict[dict_name]['positive_count']+1;  
        else:
          self.player_dict[dict_name]['negative_count'] = self.player_dict[dict_name]['negative_count']+1;
    return self.player_dict
      
  def process_team_dict(self, tweet, result):
    for team_name in self.team_names_dict:
      if any(nick_name in tweet for nick_name in self.team_names_dict[team_name]):
        dict_name = "team"+team_name+"_dict"
        if result == 4:
          self.team_dict[dict_name]['positive_count']= self.team_dict[dict_name]['positive_count']+1;  
        else:
          self.team_dict[dict_name]['negative_count'] = self.team_dict[dict_name]['negative_count']+1;
    return self.team_dict

  def process_verified_dict(self, tweet):
    verified_dict={}
    verified_dict['text']=''
    print tweet
    print "adasdasadasda teqwe"
    data = json.loads(tweet.encode('ascii','ignore'))
    if data['user']['verified'] == True:
      verified_dict['text']=data.text
    return verified_dict['text']

  def sent_to_mongo(self, tweet):
      db = pymongo.MongoClient().Android
      db.SampleTweets4.save(json.loads(tweet))

  def start_proc(self):
    db = pymongo.MongoClient().Android
    tweets = db.ARGBRA2.find( { 'lang' : 'en' } )
    i = 0

    for tweet in tweets:
        i+=1
        dat = tweet['text']
        print dat
        result = self.get_senti_value(dat)
        self.process_game_dict(tweet,result)
        #process_team_dict(tweet)
        #process_player_dict(tweet)
        #process_verified_dict(tweet)
        
        print self.game_dict
        print "\n"

        if i%5==0:
          time.sleep(3)

if __name__ == '__main__':
  t = tweet_process()
  t.start_proc()


  # get_senti_value('that is an off side')
  # get_senti_value('that is a foul')
  # get_senti_value('that is a goal')

  # count = 0
  # listener = TwitterListener(tweets_queue)
  # listener.listen(['android'])
  # while True:
  #   tweet = tweets_queue.get()
  #   get_senti_value(tweet)
  #   process_game_dict(tweet)
  #   process_team_dict(tweet)
  #   process_player_dict(tweet)
  #   process_verified_dict(tweet)
  # 