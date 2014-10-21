from gevent import monkey
monkey.patch_all()
import threading 
import ast
import json

import time
from threading import Thread
from flask import Flask, render_template, session, request
from flask.ext.socketio import SocketIO, emit, join_room, leave_room
from Queue import Queue
from TwitterListener import TwitterListener
import pymongo
from dateutil import parser
import random

app = Flask(__name__)
app.debug = True
socketio = SocketIO(app)
thread = None

@app.route('/')
def hello():
    return "Hello World!"

@app.route('/index')
def index():
    return render_template('home.html')

@socketio.on('my event', namespace='/test')
def test_message(message):
    import tweet_process
    tweet_pr = tweet_process.tweet_pr()
    count = 0
    verified_dict=[]
    db = pymongo.MongoClient().Android;
    tweets = db.FRAPOR.find()
    i = 1
    prev_min=47
    for tweet in tweets:
        event_dict={}
        
        string_date = tweet['created_at']
        d_date = parser.parse(string_date)
        min = d_date.minute
        count+=1

        if tweet['user']['verified'] == True:
            verified_dict.append(tweet['user']['name']+" : "+tweet['text'])
            
        if prev_min != min:
            event_dict={}

            ##################deleteMe#######################

            # img_dict={}
            # db = pymongo.MongoClient().Android
            # number = random.randint(0,560)
            # comms = db.FRAPOR.find({"extended_entities.media.media_url_https":{"$exists":True}},{"_id":0,"extended_entities.media.media_url_https":1}).limit(-1).skip(number).next()
            # img_url = comms['extended_entities']['media'][0]['media_url_https'].encode('ascii','ignore')
            # img_dict["img_url"]=img_url
            # print img_dict
            ##################deleteMe#######################
        #print count
            db = pymongo.MongoClient().Android
            comms = db.FRAPORCOMM.find({"time":i})
            for c in comms:
                txt = c['comm'].encode('ascii','ignore')
                if "g_o_a_l" in txt:
                    temp = txt.split("{")[1].split("}")[0]
                    event_dict["is_goal"]=1
                    event_dict["player"]=temp.split(":")[1]
                    event_dict["time"]= txt.split("u'")[0].split(":")[0] 
                    event_dict["team"]=temp.split(":")[2]
                    event_dict["is_yellow"]=0
                    print event_dict
                    print "-----------------------------"

                if "Yellow Card" in txt:
                    event_dict["is_yellow"]=1
                    event_dict["player"]=txt.split("Yellow Card")[1]  
                    print event_dict 
            i+=1
            dat = tweet['text']
            result = tweet_pr.get_senti_value(dat)
            game_dict = tweet_pr.process_game_dict(dat,result)
            if count == 0:
                count = 5;
            
            game_dict['count'] = count
            team_dict = tweet_pr.process_team_dict(dat, result)
            player_dict = tweet_pr.process_player_dict(dat, result)
            #game_dict={'positive_count':0,'negative_count':0,'count':count}
            count=0
            prev_min=min
            emit('my response',{'data': game_dict, 'team' : team_dict, 'goal' : event_dict, 'verified' : verified_dict, 'player_dict' : player_dict})
            


        # i+=1
        # dat = tweet['text']
        # print dat
        # result = tweet_pr.get_senti_value(dat)
        # game_dict = tweet_pr.process_game_dict(tweet,result)
        # #process_team_dict(tweet)
        # #process_player_dict(tweet)
        # #process_verified_dict(tweet)
        
        # print game_dict
        # print "\n"

        # if i%5==0:
        #   time.sleep(3)

    	


@socketio.on('connect', namespace='/test')
def test_connect():
    emit('my', {'data': 'Connected', 'count': 0})


if __name__ == '__main__':
    socketio.run(app)