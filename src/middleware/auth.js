const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const _id = jwt.verify(token, process.env.JWT_SECRETE)._id
    const user = await User.findOne({ _id , 'tokens.token' : token});
    if (!user) throw new Error()
    req.user = user;
    req.token = token
    next();
  } catch {
    res.status(401).send({error : 'please login first!'});
  }
};

module.exports = auth;
