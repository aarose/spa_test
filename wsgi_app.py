import webapp2

from users import handlers

config = {
    'webapp2_extras.sessions': {'secret_key': 'Yk7LS4Rnb9j2UPGlTzVz'},
    'webapp2_extras.auth': {'user_model': 'users.models.User'},
}

routes = [
    webapp2.Route(
        r'/api/v1/signup',
        handler=handlers.SignupHandler,
        name='signup',
        methods=['POST', 'OPTIONS'],
    ),
    webapp2.Route(
        r'/api/v1/login',
        handler=handlers.LoginHandler,
        name='login',
        methods=['POST', 'OPTIONS'],
    ),
    webapp2.Route(
        r'/api/v1/logout',
        handler=handlers.LogoutHandler,
        name='logout',
        methods=['GET', 'OPTIONS'],
    ),
    webapp2.Route(
        r'/api/v1/users',
        handler=handlers.UserListHandler,
        name='user-list',
        methods=['GET', 'OPTIONS'],
    ),
    webapp2.Route(
        r'/api/v1/users/current',
        handler=handlers.UserHandler,
        name='user',
        methods=['GET', 'OPTIONS'],
    ),
]

app = webapp2.WSGIApplication(routes, debug=False, config=config)
