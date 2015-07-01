import re

import webapp2_extras

from token_auth.handlers import (
    token_required,
    JsonHandler,
)
from token_auth.models import Token
from .models import User


class UserListHandler(JsonHandler):
    """ Deals with actions that target all users. """
    @token_required
    def get(self):
        """ List all active users. """
        users = User.query().fetch()
        users_info = [user.serialize() for user in users]
        self.return_success(data=users_info)


class UserHandler(JsonHandler):
    """ Deals with actions that target a specific user. """
    def _get_user(self, user_id):
        """ Return the user object. """
        pass

    @token_required
    def get(self):
        """ Return detail view of user with matching ID. """
        self.response.write('users go here')

    @token_required
    def put(self):
        """ Update user with matching ID. """
        pass

    @token_required
    def delete(self):
        """ Delete the user with this ID. """
        pass


class SignupHandler(JsonHandler):
    """ Handler to manage user creation. """

    def is_data_valid(self, required_fields):
        """ Extends data validation. """
        is_valid = super(SignupHandler, self).is_data_valid(required_fields)

        # Verify that all required fields are unicode or str
        for field in required_fields:
            if not isinstance(self.data.get(field), (str, unicode)):
                self.error_messages.append('{} must be a string'.format(field))
                is_valid = False

        # Ensure the email has an '@' and a '.' in it, in that order
        email = self.data.get('email')
        if email and not re.match(r'[^@]+@[^@]+\.[^@]+', email):
            self.error_messages.append('Invalid email')
            is_valid = False

        return is_valid

    def post(self):
        """ Create a new user. """
        # Verify that required fields are present, and data is valid
        required_fields = ['first_name', 'last_name', 'email', 'password']
        if not self.is_data_valid(required_fields):
            self.return_error(self.error_messages)
            return

        # Create the User object
        email = self.data.get('email').lower()
        user_data = User.create_user(
            email,  # unique ID key
            unique_properties=['email'],
            email=email,
            first_name=self.data.get('first_name'),
            last_name=self.data.get('last_name'),
            password_raw=self.data.get('password'),
            verified=False,
        )

        user = user_data[0]
        if not user:
            self.return_fail('This email is already in use.')

        self.return_success()


class LoginHandler(JsonHandler):
    def post(self):
        """ Logs the user in, returns an api key. """
        # Verify that required fields are present, and data is valid
        required_fields = ['email', 'password']
        if not self.is_data_valid(required_fields):
            self.return_error(self.error_messages)
            return

        # Verify that the password is correct
        email = self.data.get('email').lower()
        password = self.data.get('password')
        try:
            user_info = self.auth.get_user_by_password(email, password)
            user = User.get_by_id(user_info['user_id'])
        except (webapp2_extras.auth.InvalidAuthIdError,
                webapp2_extras.auth.InvalidPasswordError):
            # Obscure source of error, for security.
            self.return_fail('Either the email or password was incorrect.')
            return

        # Update the user's status to 'online'
        user.online = True
        user.put()

        # Create a Token for this User
        token = Token()
        token.user = user
        token.put()

        # Return the auth token and ID to use together
        token = token.token
        self.return_success(data={'auth_token': token})


class LogoutHandler(JsonHandler):
    @token_required
    def get(self):
        """ Logs the user out by getting rid of the session. """
        # Set User's status to offline
        self.user.online = False
        self.user.put()

        # Delete the Token for this session
        self.token.key.delete()

        self.return_success()
