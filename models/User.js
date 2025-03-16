const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Bắt buộc nhập tên'],
      maxLength: [50, 'Tên độ dài dưới 50 kí tự'],
    },
    email: {
      type: String,
      required: [true, 'Bắt buộc nhập email'],
      unique: true,
      match: [/.+\@.+\..+/, 'Email không hợp lệ'],
    },
    password: {
      type: String,
      required: [true, 'Bắt buộc nhập mật khẩu'],
      minlength: [8, 'Mật khẩu phải có ít nhất 8 kí tự'],
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Bắt buộc nhập ngày sinh'],
      validate: {
        validator: (val) => {
          if (new Date(val).getTime() > Date.now()) {
            throw new Error('Ngày sinh phải nhỏ hơn hoặc bằng ngày hiện tại');
          }
          return true;
        },
        message: function (props) {
          return props.reason.message;
        },
      },
    },
    role: {
      type: String,
      enum: ['staff', 'admin'],
      default: 'staff',
    },
    photo: {
      type: String,
    },
  },
  {
    collection: 'users',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.virtual('photoUrl').get(function () {
  return `/uploads/${this.photo}`;
});

const User = model('User', userSchema);

module.exports = User;
