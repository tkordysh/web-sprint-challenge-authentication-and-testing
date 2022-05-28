const { JWT_SECRET } = require('../secrets')
const jwt = require('jsonwebtoken')

const restrict = (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    return next({ status: 401, message: "token required" })
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if(err) {
      next({ status: 401, message: "token invalid" })
    } else {
      next()
    }
  })
 
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};

const checkPayload = (req, res, next) => {
  next()
}
const checkUsernameFree = (req, res, next) => {
  next()
}
const checkUsernameExists = (req, res, next) => {
  next()
}



module.exports = {
  restrict,
  checkPayload,
  checkUsernameExists,
  checkUsernameFree
}