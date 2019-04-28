Project
--
Manch App

Stack Used
---

- NodeJs
- DynamoDB

Note : All API's are Auth Protected

API's Details
------------
URL : https://manch-app.herokuapp.com/create/user
Method : POST
payload : 
```
{
	"email":"yogendrasaxena56@gmail.com",
	"password":"12345600",
	"age":"24",
	"gender":"MALE"
	
}
```
Functionality : It Register/Create Users into the APP , Contains all Fields Validation.

----
----
URL : https://manch-app.herokuapp.com/login
Method : POST
payload:
```
{
	"email":"yogendrasaxena56@gmail.com",
	"password":"12345600"
}
```
Functionality : It Login Users into the APP , Contains all Fields Validation.
In Response ==> JWT Token
```
{
    "status": "true",
    "info": "Successfully Loged In",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InlvZ2VuZHJhc2F4ZW5hNTZAZ21haW
wuY29tIiwiaWF0IjoxNTU2NDg1NjU2fQ.5BZNEuGfQiHBbfYRlbdJCv4mco96aDibP4Ma-jw_FSY"
}
```

----
----
URL : https://manch-app.herokuapp.com/create/post
Method : POST
payload:
```
{
	"post":"Marvel EndGame is breaking all Records"
}
```
**Header :** 
apiKey : JWT_TOKEN_OF_LOGEDIN_USER
Functionality : Logged In user can Create Post

------
------
URL : https://manch-app.herokuapp.com/follow/user/:email
example: https://manch-app.herokuapp.com/follow/user/yogendra.saxena@incred.com
Method : GET
**Header :** 
apiKey : JWT_TOKEN_OF_LOGEDIN_USER
Functionality : Logged In user can follow some other User

------
------

URL : https://manch-app.herokuapp.com/fetch/post
Method : GET
**Header :** 
apiKey : JWT_TOKEN_OF_LOGEDIN_USER
Functionality : Get All Posts of the Logged In User

------
------

URL : https://manch-app.herokuapp.com/fetch/user
Method : GET
**Header :** 
apiKey : JWT_TOKEN_OF_LOGEDIN_USER
Functionality : Get All details of the Logged In User

-------
------

URL : https://manch-app.herokuapp.com/check/following/:postId
example : https://manch-app.herokuapp.com/check/following/e8cde1da-ca11-46f7-a357-894058c69fa5
Method : GET
**Header :** 
apiKey : JWT_TOKEN_OF_LOGEDIN_USER
Functionality : Checks if the Logged In user Follows the Author of the Passed PostId

-------
-------

URL : https://manch-app.herokuapp.com/logout
Method : DELETE
**Header :** 
apiKey : JWT_TOKEN_OF_LOGEDIN_USER
Functionality : Log Out the User 

Author
------
Yogendra Saxena