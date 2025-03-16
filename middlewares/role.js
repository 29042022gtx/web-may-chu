const { ObjectId } = require('mongoose').Types;
const User = require('../models/User');

const role = (roles) => {
  return async (req, res, next) => {
    const id = req.user.id;
    if (!ObjectId.isValid(id)) {
      return res.redirect('/dang-nhap');
    }
    const user = await User.findById(id);
    if (!user) {
      return res.redirect('/dang-nhap');
    }

    if (!Array.isArray(roles) || !roles.includes(user.role)) {
      req.flash('error', 'Bạn không có quyền truy cập');
      return res.redirect('/');
    }

    next();
  };
};

module.exports = role;
