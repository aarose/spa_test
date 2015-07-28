import binascii
import os

from google.appengine.ext import ndb

from users.models import User


TOKEN_TIMEOUT = 7 * 24 * 60 * 60  # a week, in seconds


class Token(ndb.Model):
    user = ndb.StructuredProperty(User)
    token = ndb.StringProperty()
    created = ndb.DateTimeProperty(auto_now_add=True)

    @classmethod
    def generate_token(cls):
        """ Generate a token string. """
        return binascii.hexlify(os.urandom(20)).decode()

    def put(self, *args, **kwargs):
        if not self.token:
            self.token = self.generate_token()
        return super(Token, self).put(*args, **kwargs)

    def is_valid(self, timeout=TOKEN_TIMEOUT):
        """ Returns False if the timeout amount has passed since creation. """
        pass
