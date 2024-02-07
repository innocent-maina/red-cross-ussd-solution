const { Schema, model } = require('mongoose');

const UsersSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: Number,
      required: false,
      unique: true,
    },
    password: String,
    currentLocation: {
      type: String,
      required: false,
    },
    emergencyContact: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = model('User', UsersSchema);
