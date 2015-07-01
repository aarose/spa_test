from google.appengine.ext import ndb


class Message(ndb.Model):
    recipient = ndb.StructuredProperty('users.models.User')
    sender = ndb.StructuredProperty('users.models.User')
    subject = ndb.StringProperty(indexed=False)
    content = ndb.StringProperty(indexed=False)
    date = ndb.DateTimeProperty(auto_now_add=True)

    @classmethod
    def create(cls):
        """ Create a message instance. """
        pass

    def validate(self):
        """ Ensure the sender is not the same as the recipient. """
        pass
