import binascii
import os

from google.appengine.ext import ndb

from users.models import User


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
