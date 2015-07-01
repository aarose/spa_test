import httplib
import json

import webapp2
from webapp2_extras import (
    auth,
    sessions,
)

from .models import Token
from users.models import User


def token_required(handler):
    """ Decorator that ensures that a valid auth token is provided. """
    def verify_token(self, *args, **kwargs):
        # Check that an Authorization header with token was provided
        headers = self.request.headers
        if not headers.get('Authorization'):
            self.return_error('Authorization token was not provided.')
            return

        # Extract the Authorization toke
        try:
            label, token = headers.get('Authorization').split(' ')
            if label != 'Token':
                return self.return_error('Invalid token format.')
        except (AttributeError, ValueError):
            # Happens with too many values to unpack, or wrong type
            return self.return_error('Invald token.')

        # Verify that the token is valid
        valid_token = Token.query(Token.token == token).get()
        if not valid_token:
            return self.return_error('Invald token.')

        # Add the token and user to the handler for easy access
        self.token = valid_token
        self.user = User.query(User.email == valid_token.user.email).get()

        return handler(self, *args, **kwargs)

    return verify_token


class BaseHandler(webapp2.RequestHandler):
    """ Adds convenience methods relating to authorization. """
    @webapp2.cached_property
    def auth(self):
        """ Shortcut to access the auth instance. """
        return auth.get_auth()

    def dispatch(self):
        """ Retrieves a session store for this request. """
        self.session_store = sessions.get_store(request=self.request)

        try:
            # Dispatch the request
            webapp2.RequestHandler.dispatch(self)
        finally:
            # Save all sessions
            self.session_store.save_sessions(self.response)


class JsonHandler(BaseHandler):
    def set_headers(self):
        self.response.headers['Content-Type'] = 'application/json'
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.headers['Access-Control-Allow-Headers'] = (
            'Content-Type, Authorization')

    def return_success(self, data=None):
        """ Returns a status of 'ok'. """
        self.response.write(json.dumps({'status': 'ok', 'data': data}))

    def return_fail(self, fail_messages):
        """
        Returns a status of 'fail' and accompanying messages.

        Args:
            fail_messages: iterable of strings. Each is an message about
                something that contributed to the failure.
        """
        self.response.write(json.dumps({
            'status': 'fail',
            'messages': fail_messages,
        }))

    def return_error(self, error_messages, http_code=httplib.BAD_REQUEST):
        """
        Returns a status of 'error', accompanied by a custom error message.

        Args:
            error_messages: Iterable of strings. Each is an error message.
            http_code (int): HTTP code to set for the response code. Defaults
                to 400 (Bad Request).
        """
        message = webapp2.Response.http_status_message(http_code)
        self.response.status_int = http_code
        self.response.status_message = message

        self.response.write(json.dumps({
            'status': 'error',
            'messages': error_messages,
        }))

    def dispatch(self):
        """ Add common headers and decode JSON data for posts. """
        self.set_headers()

        if self.request.method == 'POST':
            try:
                self.data = json.loads(self.request.body)
                super(JsonHandler, self).dispatch()
            except ValueError:
                self.return_error('Invalid JSON')
        else:
            super(JsonHandler, self).dispatch()

    def is_data_valid(self, required_fields):
        """
        Validates self.data.

        Args:
            required_fields: Iterable of keys that must be present in the
                JSON response body.
        """
        self.error_messages = []
        is_valid = True

        # Verify that all required fields are present
        for field in required_fields:
            if not self.data.get(field):
                self.error_messages.append('{} is required'.format(field))
                is_valid = False

        return is_valid
