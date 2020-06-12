import os
import logging
import uuid
import time

import dazl
from dazl import exercise

dazl.setup_default_logger(logging.INFO)

class User:
    Aliases = 'User.Aliases'
    SessionRequest = 'User.SessionRequest'

def main():
    url = os.getenv('DAML_LEDGER_URL')
    admin_env = os.getenv('DAML_LEDGER_PARTY')
    admin = "UserAdmin" if not admin_env else admin_env

    network = dazl.Network()
    network.set_config(url=url)

    logging.info(f'starting a the operator_bot for {admin}')
    client = network.aio_party(admin)

    @client.ledger_ready()
    def bot_startup(event): # pylint: disable=unused-variable
        logging.info(f'Bot starts up {event}! Make sure that we have an {User.Aliases} contract.')

        aliases = client.find_active(User.Aliases)
        logging.info(f'Found {aliases}')
        if not aliases:
            return client.submit_create( User.Aliases
                                       , { 'admin' : admin
                                         , 'userNames' : { 'textMap' : {} }
                                       } )

    @client.ledger_created(User.Aliases)
    def alias_created(event): # pylint: disable=unused-variable
        logging.info(f'Created an Aliases contract {event}, checking for any requests to acknowledge.')
        res = client.find_active(User.SessionRequest)
        logging.info(f'Found {len(res)} {User.SessionRequest}.')
        return  [ exercise( cid, 'Acknowledge', {}) for cid in res.keys() ]

    @client.ledger_created(User.SessionRequest)
    def process_login(event): # pylint: disable=unused-variable
        logging.info(f'A client has logged in: {event}.')
        return client.submit_exercise( event.cid, 'Acknowledge', {})

    network.run_forever()

if __name__ == '__main__':
    main()
