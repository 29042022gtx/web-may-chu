var express = require('express');
const { ObjectId } = require('mongodb-legacy');
const { format } = require('date-fns');
var router = express.Router();

const MongoClient = require('mongodb-legacy').MongoClient;
const client = new MongoClient('mongodb://127.0.0.1:27017');
const db = client.db('manage_staff');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});
router.get('/danh-sach', async function (req, res, next) {
  const staffs = await db.collection('staffs').find().toArray();
  res.render('staff-list', {
    staffs,
    err: null,
  });
});

router.get('/them', async function (req, res, next) {
  res.render('staff-form', { mode: 'create', staff: null });
});
router.post('/them', async function (req, res, next) {
  let { name, dateOfBirth } = req.body;
  dateOfBirth = new Date(dateOfBirth);
  if (!name || dateOfBirth.getTime() > Date.now()) {
    res.send('Loi post them');
    // res.render('staff-form', { mode: 'create' });
    return;
  }
  db.collection('staffs').insertOne({
    name,
    dateOfBirth,
  });
  res.redirect('/danh-sach');
});

router.get('/sua/:id', async function (req, res, next) {
  const id = req.params.id;
  if (id?.length != 24) {
    res.send('Loi');
    // res.render('staff-form', { mode: 'create' });
    return;
  }
  const staff = await db
    .collection('staffs')
    .findOne({ _id: new ObjectId(req.params.id) });
  if (!staff) {
    res.send('Loi get sua');
    return;
  }
  staff.dateOfBirth = format(staff.dateOfBirth, 'yyyy-MM-dd');
  res.render('staff-form', {
    mode: 'update',
    staff,
  });
});
router.post('/sua/:id', async function (req, res, next) {
  const id = req.params.id;
  let { name, dateOfBirth } = req.body;
  dateOfBirth = new Date(dateOfBirth);
  if (!name || dateOfBirth.getTime() > Date.now() || id?.length != 24) {
    res.send('Loi post sua');
    // res.render('staff-form', { mode: 'create' });
    return;
  }
  await db.collection('staffs').updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        name,
        dateOfBirth,
      },
    }
  );
  res.redirect('/danh-sach');
});

router.post('/xoa', async function (req, res, next) {
  const id = req.body.id;
  if (id?.length != 24) {
    res.send('Loi xoa')
    return;
  }
  await db.collection('staffs').deleteOne({ _id: new ObjectId(id) });
  res.redirect('danh-sach');
});

module.exports = router;
