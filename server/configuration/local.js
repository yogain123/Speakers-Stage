var jwt = require('jsonwebtoken');

module.exports = {
  secret:"manch",
  accessKeyId: "dummyvalue",
  secretAccessKey : "dummyvalue",
  getToken(email){
    let token = jwt.sign({
      email,
    }, "manch");
    return token;
  },
};