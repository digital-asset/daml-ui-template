import os
import logging
import uuid
import time

import dazl
from dazl import exercise

dazl.setup_default_logger(logging.INFO)

class User:
    SessionRequest = 'User.SessionRequest'
    SessionRenameRequest = 'User.SessionRenameRequest'

def main():
    url = os.getenv('DAML_LEDGER_URL')
    admin_env = os.getenv('DAML_LEDGER_PARTY')
    admin = "UserAdmin" if not admin_env else admin_env

    network = dazl.Network()
    network.set_config(url=url)

    logging.info(f'starting a the operator_bot for {admin}')
    client = network.aio_party(admin)

    @client.ledger_created(User.SessionRequest)
    def process_request(event): # pylint: disable=unused-variable
        logging.info(f'A client has logged in: {event}.')
        return client.submit_exercise( event.cid, 'Acknowledge', {})

    @client.ledger_created(User.SessionRenameRequest)
    def process_rename(event): # pylint: disable=unused-variable
        logging.info(f'A client requests a rename: {event}.')
        return client.submit_exercise( event.cid, 'AcknowledgeRename', {})

    network.run_forever()

if __name__ == '__main__':
    main()
