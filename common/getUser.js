const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongoose').Types;
const User = require('../models/User');

const getUser = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.id;

    if (!ObjectId.isValid(id)) {
      return next();
    }
    const user = await User.findById(id);
    if (!user) {
      return next();
    }
    res.locals.user = user;
    next();
  } catch (e) {
    console.error(e);
    return next();
  }
};

module.exports = getUser;
