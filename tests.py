import unittest

from google.appengine.ext import ndb
from google.appengine.ext import testbed


from token_auth.models import Token
from users.models import User


class TestTokenApp(unittest.TestCase):
    def setUp(self):
        # First, create an instance of the Testbed class.
        self.testbed = testbed.Testbed()
        # Then activate the testbed, which prepares the service stubs for use.
        self.testbed.activate()
        # Next, declare which service stubs you want to use.
        self.testbed.init_datastore_v3_stub()
        # Clear ndb's in-context cache between tests.
        # This prevents data from leaking between tests.
        ndb.get_context().clear_cache()

    def tearDown(self):
        self.testbed.deactivate()

    def test_creation(self):
        """ Should create a token. """
        print 'Testing creation'
        user_info = User.create_user()
        user = User.get_by_id(user_info['user_id'])
        token = Token()
        token.user = user
        token.put()
        results = Token.query().fetch(2)
        self.assertEqual(1, len(results))
        self.assertEqual(user, results[0].user)

    def test_validation(self):
        """ Should return False when the token expires. """


if __name__ == "__main__":
    unittest.main()
