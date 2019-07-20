const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const {
  deleteSession,
  getUser,
  createUser,
  createSession,
  getPostUsingEmail,
  getPostUsingPostId,
  createPost,
  authorization
} = require("./controller");
const {
  joiValidation
} = require('./configuration/validation');

const {
  getToken
} = require("./configuration/local");

router.get("/",function(req,res,next){
  res.send(`${JSON.stringify(process.env)}`);
})

router.post("/create/user", async function (req, res, next) {
  try {

    /**
     * Do Field Validation , If Validation Fails then throw Error else,
     * Check If User Already Present
     * if Yes , Throw Error with info "User Already Present"
     * If No , Then Create User
     * throw error if anything else goes wrong
     */

    let reqData = req.body;
    let error = joiValidation(reqData, "userSchema");
    if (error) {
      throw {
        status: "false",
        info: error && error.message
      };
    }

    let userDetails = await getUser(reqData.email);
    if (userDetails) {
      throw {
        status: "false",
        info: "User Already Present"
      };
    }

    reqData.password = bcrypt.hashSync(reqData.password);
    reqData.followers = [reqData.email];
    reqData.following = [reqData.email];
    await createUser(reqData);
    res.send({
      status: "true",
      info: "User Successfully Created"
    });
  } catch (error) {
    res.send(error);
  }
})

router.post("/login", async function (req, res, next) {
  /**
   * Do Field Validation , If Validation Fails then throw Error else,
   * Check Password and validation of user , if failed then
   * throw Error with info "User not Created or Password Incorrect" , else
   * Login User and send a jwt token in resposne => to be used in other routes as an authentication
   * throw error if anything else goes wrong
   * Note : This JWT token will have email id of the user as part of payload
   */
  try {
    let reqData = req.body;
    let error = joiValidation(reqData, "loginSchema");
    if (error) {
      throw {
        status: "false",
        info: error && error.message
      };
    }
    let userDetails = await getUser(reqData.email);
    if (!userDetails)
      throw {
        status: "false",
        info: "User Not Created"
      }

    let checkPasswordValidation = bcrypt.compareSync(reqData.password, userDetails.password);
    if (!checkPasswordValidation)
      throw {
        status: "false",
        info: "Password is incorrect"
      }

    let token = getToken(reqData.email);
    await createSession({
      sessionId: token,
      email: reqData.email
    });

    res.send({
      status: "true",
      info: "Successfully Loged In",
      token
    });

  } catch (error) {
    res.send(error);
  }
})

router.post("/create/post", authorization, async function (req, res, next) {
  try {

    /**
     * Do Field Validation , If Validation Fails then throw Error, else
     * Create Post.
     * throw error if anything else goes wrong
     */

    let reqData = req.body;
    let error = joiValidation(reqData, "postSchema");
    if (error) {
      throw {
        status: "false",
        info: error && error.message
      };
    }

    let postId = uuid();
    reqData.postId = postId;
    await createPost(reqData)
    res.send({
      status: true,
      info: "Post Created Successfully"
    });
  } catch (error) {
    res.send(error);
  }
})


router.get("/follow/user/:otherEmail", authorization, async function (req, res, next) {
  try {
    let reqData = req.body;
    Object.assign(reqData, req.params);

    /**
     * Do Field Validation , If Validation Fails then throw Error, else
     * Follow User whose emailId is => :otherEmail
     * update "followings" of logedin user email , and update "followers" of :otherEmail
     * throw error if anything else goes wrong
     */

    let error = joiValidation(reqData, "followUserSchema");
    if (error) {
      throw {
        status: "false",
        info: error && error.message
      };
    }

    let myUserDetails = await getUser(reqData.email);
    let otherUserDetails = await getUser(reqData.otherEmail);
    if (!myUserDetails || !otherUserDetails)
      throw {
        status: false,
        info: "One of the User not Present"
      }
    myUserDetails.following = [...new Set([...myUserDetails.following, reqData.otherEmail])];
    otherUserDetails.followers = [...new Set([...otherUserDetails.following, reqData.email])];
    await createUser(myUserDetails);
    await createUser(otherUserDetails);
    res.send({
      status: true,
      info: `${reqData.email} is now following ${reqData.otherEmail}`
    });
  } catch (error) {
    res.send(error);
  }
})

router.get("/fetch/post", authorization, async function (req, res, next) {
  try {
    /**
     * Fetch All post of the user logged in ==> Loged In User email is extracted by decoding passed token
     * throw error if anything else goes wrong
     */
    let reqData = req.body;
    let allPosts = await getPostUsingEmail(reqData.email);
    res.send({
      status: true,
      info: `All post by ${reqData.email}`,
      response: allPosts
    });
  } catch (error) {
    res.send(error);
  }
})

router.get("/fetch/user", authorization, async function (req, res, next) {
  try {
    /**
     * Fetch All Details of the user logged in ==> Loged In User email is extracted by decoding passed token
     * throw error if anything else goes wrong
     */
    let reqData = req.body;
    let user = await getUser(reqData.email);
    let posts = await getPostUsingEmail(reqData.email);
    user.posts = posts;
    res.send({
      status: true,
      info: `${reqData.email} details are`,
      response: user
    });
  } catch (error) {
    res.send(error);
  }
})

router.delete("/logout", authorization, async function (req, res, next) {
  try {
    /**
     * Logging Out the logged In User==> Loged In User email is extracted by decoding passed token
     * throw error if anything else goes wrong
     */
    let reqData = req.body;
    await deleteSession(reqData.email);
    res.send({
      status: true,
      info: `${reqData.email} logged out successfully`
    });
  } catch (error) {
    res.send(error);
  }
})

router.get("/check/following/:postId", authorization, async function (req, res, next) {
  try {
    /**
     * Do Field Validation , If Validation Fails then throw Error, else
     * Check If Logged In User Follows the Author of Passes PostId. 
     * Loged In User email is extracted by decoding passed token
     * throw error if anything else goes wrong
     */
    let reqData = req.body;
    Object.assign(reqData, req.params);

    let error = joiValidation(reqData, "checkFollowingSchema");

    if (error) {
      throw {
        status: "false",
        info: error && error.message
      };
    }
    let myUserDetails = await getUser(reqData.email);
    let postDetails = await getPostUsingPostId(reqData.postId);
    if (!postDetails)
      throw {
        status: false,
        info: "Post Id does not Exists"
      }
    let checkIfFollowing = myUserDetails.following.includes(postDetails.email);
    if (checkIfFollowing)
      res.send({
        status: true,
        info: `You (${reqData.email}) FOLLOW the author (${postDetails.email}) of this postId`
      });
    else
      res.send(({
        status: true,
        info: `You (${reqData.email}) DO NOT FOLLOW the author (${postDetails.email}) of this postId`
      }));
  } catch (error) {
    res.send(error);
  }
})

module.exports = router;