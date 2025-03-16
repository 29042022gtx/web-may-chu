const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {};

authController.getLogin = async (req, res) => {
  res.render('auth/login');
};

authController.postLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password1' });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create and send token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    req.flash('success', 'Đăng nhập thành công');
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

authController.logout = (req, res) => {
  res.clearCookie('token');
  req.flash('success', 'Đăng xuất thành công');
  res.redirect('/');
};

module.exports = authController;
