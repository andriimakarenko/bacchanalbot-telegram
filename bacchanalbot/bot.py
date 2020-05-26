#####################################################################
#     ____       ____  _________    ____  ____  __________________  #
#    / __ \_  __/ __ \/ ____/   |  / __ \/ __ )/ ____/ ____/ ____/  #
#   / / / / |/_/ / / / __/ / /| | / / / / __  / __/ / __/ / /       #
#  / /_/ />  </ /_/ / /___/ ___ |/ /_/ / /_/ / /___/ /___/ __/      #
#  \____/_/|_/_____/_____/_/  |_/_____/_____/_____/_____/_/         #
#                                                                   #
#####################################################################

import requests
import json
import os
from os import path
from bacchanalbot.utilities import *


class Bot(object):
    token = ''
    urlbase = ''
    triggers = []
    sharePath = '/tmp/bacchanalbot/triggers.json'

    def __init__(self):
        with open('tg.key') as file:
            self.token = file.read()
        self.urlbase = f"https://api.telegram.org/bot{self.token}/"

        with open('triggers.json') as file:
            self.triggers = json.loads(file.read())

    def handleMessage(self, message):
        if 'text' not in message:
            return

        self.reloadTriggersFromShare()
        words = message['text'].lower().split()
        # Detect words when right next to a non-letter char
        words = [clean(word) for word in words] 
        
        for trigger in self.triggers:
            for word in words:
                if word == trigger['phrase'].lower():
                    json_data = {
                        'chat_id': message['chat']['id'],
                        'text': lintResponse(trigger['response']),
                        'reply_to_message_id': message['message_id']
                    }

                    url = self.urlbase + 'sendMessage'
                    r = requests.post(url,
                                      headers={'content-type': 'application/json'},
                                      data=json.dumps(json_data).encode('utf-8'))

    def getTriggers(self):
        self.reloadTriggersFromShare()
        return json.dumps(self.triggers, indent=4)

    def setTriggers(self, triggers):
        self.triggers = triggers
        self.writeTriggersToShare()
        with open('triggers.json', 'w') as file:
            file.write(self.getTriggers())

    def reloadTriggersFromShare(self):
        if path.exists(self.sharePath):
            with open(self.sharePath) as file:
                self.triggers = json.loads(file.read())

    def writeTriggersToShare(self):
        try:
            with open(self.sharePath, 'w+') as file:
                file.write(json.dumps(self.triggers, indent=4))
        except Exception as e:
            print(e)
            os.makedirs('/tmp/bacchanalbot/')
            self.writeTriggersToShare()

    ############################
    #      FOR DEBUGGING       #
    ############################

    def dumpTriggers(self):
        for trigger in self.triggers:
            print(f"{trigger['phrase']} : {trigger['response']}\n")
