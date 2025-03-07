const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Bắt buộc nhập tên'],
      maxLength: [50, 'Tên độ dài dưới 50 kí tự'],
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

userSchema.virtual('photoUrl').get(function () {
  return `/uploads/${this.photo}`;
});

const User = model('User', userSchema);
module.exports = User;
