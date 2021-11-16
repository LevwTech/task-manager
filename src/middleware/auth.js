const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = function (req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.send("please authenticate");
  const tokenObj = jwt.verify(token, "authtoken");
  User.findOne(
    { _id: tokenObj._id, "token.token": tokenObj._id },
    (err, user) => {
      if (err || !user) return res.send("no user found");
      req.user = user;
      req.token = token;
      next();
    }
  );
};

module.exports = auth;
