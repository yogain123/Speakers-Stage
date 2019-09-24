Project
--
Speakers-Stage

Stack Used
---

- NodeJs
- DynamoDB

Note : All API's are Auth Protected  <br/>

API's Details
------------
URL : localhost:3003/create/user  <br/>
Method : POST  <br/>
payload : 
```
{
	"email":"yogendrasaxena56@gmail.com",
	"password":"12345600",
	"age":"24",
	"gender":"MALE"
	
}
```
Functionality : It Register/Create Users into the APP , Contains all Fields Validation.  <br/>

----
----
URL : localhost:3003/login   <br/>
Method : POST   <br/>
payload:
```
{
	"email":"yogendrasaxena56@gmail.com",
	"password":"12345600"
}
```
Functionality : It Login Users into the APP , Contains all Fields Validation.   <br/>
In Response ==> JWT Token   <br/>
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
URL : localhost:3003/create/post    <br/>
Method : POST    <br/>
payload:
```
{
	"post":"Marvel EndGame is breaking all Records"
}
```
**Header :** 
apiKey : JWT_TOKEN_OF_LOGEDIN_USER    <br/>
Functionality : Logged In user can Create Post     <br/>

------
------
URL : localhost:3003/follow/user/:email    <br/>
example: localhost:3003/follow/user/yogendra.saxena@incred.com    <br/>
Method : GET   <br/>
**Header :** 
apiKey : JWT_TOKEN_OF_LOGEDIN_USER    <br/>
Functionality : Logged In user can follow some other User    <br/>

------
------

URL : localhost:3003/fetch/post  <br/>
Method : GET  <br/>
**Header :** 
apiKey : JWT_TOKEN_OF_LOGEDIN_USER  <br/>
Functionality : Get All Posts of the Logged In User  <br/>

------
------

URL : localhost:3003/fetch/user   <br/>
Method : GET  <br/>
**Header :** 
apiKey : JWT_TOKEN_OF_LOGEDIN_USER   <br/>
Functionality : Get All details of the Logged In User   <br/>

-------
------

URL : localhost:3003/check/following/:postId   <br/>
example : localhost:3003/check/following/e8cde1da-ca11-46f7-a357-894058c69fa5  <br/>
Method : GET   <br/>
**Header :** 
apiKey : JWT_TOKEN_OF_LOGEDIN_USER    <br>
Functionality : Checks if the Logged In user Follows the Author of the Passed PostId   <br/>

-------
-------

URL : localhost:3003/logout <br/>
Method : DELETE <br/>
**Header :** 
apiKey : JWT_TOKEN_OF_LOGEDIN_USER  <br>
Functionality : Log Out the User <br/>

Author
------
Yogendra Saxena
