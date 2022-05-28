const { JWT_SECRET } = require("../secrets");
const jwt = require("jsonwebtoken");
const User = require("../users/users-model");

const restrict = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return next({ status: 401, message: "token required" });
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      next({ status: 401, message: "token invalid" });
    } else {
      req.decoded = decoded;
      next();
    }
  });

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
  const { username, password } = req.body;
  if (!username || !password) {
    next({ status: 400, message: "username and password required" });
  } else {
    next();
  }
};

async function checkUsernameFree(req, res, next) {
  try {
    const users = await User.findBy({ username: req.body.username });
    if (!users.length) {
      next();
    } else {
      next({ status: 422, message: "username taken" });
    }
  } catch (err) {
    next(err);
  }
}

const checkUsernameExists = async (req, res, next) => {
  try {
    const [user] = await User.findBy({ username: req.body.username });
    if (!user) {
      next({ status: 401, message: "invalid credentials" });
    } else {
      req.user = user;
      next();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  restrict,
  checkPayload,
  checkUsernameExists,
  checkUsernameFree,
};
