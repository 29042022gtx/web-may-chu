const express = require('express');
const staffController = require('../controllers/staffController');
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const indexRouter = express.Router();
const authRouter = express.Router();
const adminRouter = express.Router();

/* GET home page. */
indexRouter.get('/', function (req, res, next) {
  res.render('index');
});
indexRouter.get('/dang-nhap', authController.getLogin);
indexRouter.post('/dang-nhap', authController.postLogin);
indexRouter.post('/dang-xuat', authController.logout);

authRouter.use(auth);
authRouter.get('/danh-sach', staffController.getIndex);

adminRouter.use(auth, role(['admin']));
adminRouter.get('/them', staffController.getCreate);
adminRouter.post('/them', staffController.postCreate);
adminRouter.get('/sua/:id', staffController.getUpdate);
adminRouter.post('/sua/:id', staffController.postUpdate);
adminRouter.post('/xoa/:id', staffController.postDelete);

indexRouter.use(authRouter);
indexRouter.use(adminRouter);

module.exports = indexRouter;
