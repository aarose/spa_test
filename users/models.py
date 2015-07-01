from google.appengine.ext import ndb

from webapp2_extras.appengine.auth import models
from webapp2_extras.security import generate_password_hash


DEFAULT_GROUP_NAME = 'default_group'


def group_key(group_name=DEFAULT_GROUP_NAME):
    """ Constructs a Datastore key for Users. """
    return ndb.Key('Group', group_name)


class User(models.User):
    """
    Represent a registered site user.

    Subclasses the webapp2 User Extendo. Stores user credentials and
    information.
    """
    email = ndb.StringProperty(required=True)
    first_name = ndb.StringProperty(required=True)
    last_name = ndb.StringProperty(required=True)
    online = ndb.BooleanProperty(default=False)

    @classmethod
    def query_group(cls, group_name):
        """ Return all users who belong to the group with the given name, """
        return cls.query(ancestor=group_name).order(-cls.created)

    def set_password(self, raw_password):
        """ Hash and save a password for this User. """
        self.password = generate_password_hash(raw_password, length=12)

    def get_full_name(self):
        """ Return the first and last names together. """
        return '{first} {last}'.format(
            first=self.first_name, last=self.last_name)

    def serialize(self):
        """ Convert to dict format. """
        return {
            'name': self.get_full_name(),
            'uid': self.get_id(),
            'email': self.email,
            'online': self.online,
        }
