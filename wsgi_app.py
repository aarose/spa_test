import webapp2

from users import handlers

config = {
    'webapp2_extras.sessions': {'secret_key': 'Yk7LS4Rnb9j2UPGlTzVz'},
    'webapp2_extras.auth': {'user_model': 'users.models.User'},
}

routes = [
    webapp2.Route(
        r'/signup',
        handler=handlers.SignupHandler,
        name='signup',
        methods=['POST', 'OPTIONS'],
    ),
    webapp2.Route(
        r'/login',
        handler=handlers.LoginHandler,
        name='login',
        methods=['POST', 'OPTIONS'],
    ),
    webapp2.Route(
        r'/logout',
        handler=handlers.LogoutHandler,
        name='logout',
        methods=['GET', 'OPTIONS'],
    ),
    webapp2.Route(
        r'/users',
        handler=handlers.UserListHandler,
        name='user-list',
        methods=['GET', 'OPTIONS'],
    ),
    webapp2.Route(
        r'/users/<product_id:\d+>',
        handler=handlers.UserHandler,
        name='user',
        methods=['GET', 'OPTIONS'],
    ),
]

app = webapp2.WSGIApplication(routes, debug=False, config=config)