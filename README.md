# Areas for Improvement

1. Tests for backend

1. Tests for frontend

1. Adding messaging backend, and hooking it up to the frontend

1. Automatic token expiry after certain time


# References

http://blog.abahgat.com/2013/01/07/user-authentication-with-webapp2-on-google-app-engine/

http://blog.nknj.me/token-authentication-django-and-angular

## Sample curl for the backend

### Create user

    curl -H "Content-Type: application/json" -X POST -d '{"first_name": "Jane", "last_name": "Doe", "email":"test@test.com", "password": "test"}' "http://localhost:8080/api/v1/signup"

Sample response:

    {"status": "ok", "data": Null}


### Login as new user

    curl -H "Content-Type: application/json" -X POST -d '{"email":"test@test.com", "password": "test"}' "http://localhost:8080/api/v1/login"


Sample response:

    {"status": "ok", "data": {"auth_token": "a8a43fd309489c386b54c47fb5fbc1b8a375a3ec"}}

Returns the auth token to use while logged in.


### Logout user

    curl -H "Content-Type: application/json" -H "Authorization: Token a8a43fd309489c386b54c47fb5fbc1b8a375a3ec" -X GET "http://localhost:8080/api/v1/logout"

Sample response:

    {"status": "ok", "data": Null}


Token cannot be re-used.


### Get other users

    curl -H "Content-Type: application/json" -H "Authorization: Token a8a43fd309489c386b54c47fb5fbc1b8a375a3ec" -X GET "http://localhost:8080/api/v1/users"


## Deploying

    python ./appcfg.py --oauth2 -A spa-test-993 update ../Development/spa_test/
