var express = require('express');
const staffController = require('../controllers/staffController');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});
router.get('/danh-sach', staffController.getIndex);
router.get('/them', staffController.getCreate);
router.post('/them', staffController.postCreate);
router.get('/sua/:id', staffController.getUpdate);
router.post('/sua/:id', staffController.postUpdate);
router.post('/xoa/:id', staffController.postDelete);

module.exports = router;
