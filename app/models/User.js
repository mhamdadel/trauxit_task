const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    role: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      transform(doc, recored) {
        // eslint-disable-next-line no-param-reassign
        delete recored.password;
      },
    },
    timestamps: true,
  },
);

const User = model('User', userSchema);

module.exports = User;
