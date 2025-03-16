const { format } = require('date-fns');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const User = require('../models/User');
const getValidationError = require('../common/getValidationError');
const path = require('node:path');
const fs = require('node:fs');

const findUserMiddleware = async (req, res, next) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.sendStatus(400);
  const staff = await User.findOne({
    _id: ObjectId.createFromHexString(id),
    role: { $ne: 'admin' },
  });
  if (!staff) return res.sendStatus(404);
  req.staff = staff;
  next();
};

function validatePhoto(photo) {
  let errMsg = (() => {
    if (!photo.mimetype.startsWith('image/')) {
      return 'Chỉ cho phép tải lên file ảnh';
    }
    if (photo.size > 2 * 1024 * 1024) {
      return 'Ảnh phải nhỏ hơn 2MB;';
    }
  })();
  if (!errMsg) return;
  const error = new mongoose.Error.ValidationError();
  error.errors.photo = new mongoose.Error.ValidatorError({
    message: errMsg,
    path: 'photo',
  });
  throw error;
}

async function uploadPhoto(photo) {
  const uploadDir = path.join(__dirname, '../public/uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Generate unique filename
  const filename = `${Date.now()}${path.extname(photo.name)}`;
  const uploadPath = path.join(uploadDir, filename);

  // Move file to uploads directory
  await photo.mv(uploadPath);
  return filename;
}

const removeImage = (imagePath) => {
  if (!imagePath) return;
  const fullPath = path.join(__dirname, '../public/uploads', imagePath);

  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error('Error deleting image:', err);
    }
  });
};

const staffController = {
  getIndex: async (req, res, next) => {
    const staffs = await User.find({ role: { $ne: 'admin' } });
    res.render('staff-list', {
      staffs,
    });
  },
  getCreate: async (req, res) => {
    res.render('staff-form', { mode: 'create', staff: null });
  },
  postCreate: async (req, res, next) => {
    let { name, dateOfBirth } = req.body;
    try {
      const photo = req.files?.photo;
      let filename = null;
      if (photo) {
        validatePhoto(photo);
        filename = await uploadPhoto(photo);
      }
      await User.insertOne({ name, dateOfBirth, photo: filename });
    } catch (e) {
      if (e.name == 'ValidationError') {
        const validationError = getValidationError(e);
        req.flash('validationError', validationError);
        res.render('staff-form', {
          mode: 'create',
          staff: req.body,
          validationError,
        });
        return;
      }
      console.error(e);
      res.sendStatus(500);
      return;
    }
    req.flash('success', 'Tạo thành công.');
    res.redirect('/danh-sach');
  },
  getUpdate: [
    findUserMiddleware,
    async (req, res, next) => {
      const staff = req.staff.toObject();
      staff.dateOfBirth = staff.dateOfBirth.toLocaleDateString('en-CA');
      res.render('staff-form', {
        mode: 'update',
        staff,
      });
    },
  ],
  postUpdate: [
    findUserMiddleware,
    async (req, res, next) => {
      let { name, dateOfBirth } = req.body;
      const staff = req.staff;
      try {
        const photo = req.files?.photo;
        let filename = staff.photo;
        if (photo) {
          removeImage(filename);
          validatePhoto(photo);
          filename = await uploadPhoto(photo);
        }
        staff.set({
          name,
          dateOfBirth,
          photo: filename,
        });
        await staff.save({ validateModifiedOnly: true });
      } catch (e) {
        if (e.name == 'ValidationError') {
          const validationError = getValidationError(e);
          console.log(validationError);
          req.flash('validationError', validationError);
          res.render('staff-form', {
            mode: 'update',
            staff: {
              id: staff.id,
              ...req.body,
            },
            validationError,
          });
          return;
        }
        console.error(e);
        res.send(500);
        return;
      }
      req.flash('success', 'Cập nhật thành công.');
      res.redirect('/danh-sach');
    },
  ],
  postDelete: [
    findUserMiddleware,
    async (req, res, next) => {
      const staff = req.staff;
      removeImage(staff.photo);
      await staff.deleteOne();
      req.flash('success', 'Đã xóa.');
      res.redirect('/danh-sach');
    },
  ],
};

module.exports = staffController;
