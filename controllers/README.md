# API EndPoints

All Rest API endpoints information

## Users

- Get : Get all the users

  - https://needbuddy-backend.herokuapp.com/api/user

- Get : Get one the users

  - https://needbuddy-backend.herokuapp.com/api/user/(userID)

- Put : Update Passowrd

  - https://needbuddy-backend.herokuapp.com/api/user/update-password/(userID)

- Post : Create a User
  - https://needbuddy-backend.herokuapp.com/api/user

data:

```
{
    "firstName": "asfand",
    "lastName": "saddiqui",
    "email": "asfandsaddiqui16@gmail.com",
    "password": "1234Parveezbuddy",
    "username": "asdf123s",
    "accountType": "buyer"
}
```

- Delete : Delete a user

  - https://needbuddy-backend.herokuapp.com/api/user/(userID)

- Put : Update a user
  - https://needbuddy-backend.herokuapp.com/api/user/(userID)

data:

```
{
    "firstName": "asfand",
    "lastName": "saddiqui",
    "accountType": "buyer"
}
```

- Get : validate a user steps form
  - https://needbuddy-backend.herokuapp.com/api/user/validate-steps/(userID)

Response:

```
true  | false

```

- Post : Reset Password

  - https://needbuddy-backend.herokuapp.com/api/user/reset-password/(user Email)

Response:

```
let token={JWT TOKEN}

```
