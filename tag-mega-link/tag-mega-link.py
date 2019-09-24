#!/usr/bin/env python

#this python script recieves data to POST to the discord bot via command line arugments
#format of command line arugments is "tag-mega-link.py keyOne valueOne keyTwo valueTwo... "
import sys
import fileinput 
import requests
import json

portNum = "8080"

sys.argv.pop(0) #pop filename at head of argv list
postData = {} #data which we will send in our post request to the discrod bot
i = 0
while(i < len(sys.argv)-1): #build the post data dictionary from the command line arugments 
    postData[sys.argv[i]] = sys.argv[i+1]
    i += 2

headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
r = requests.post(url = "http://0.0.0.0:" + portNum + "/post-tagged-mega", data=json.dumps(postData), headers=headers)
response = r.text
print(json.dumps(postData))
print(response)

