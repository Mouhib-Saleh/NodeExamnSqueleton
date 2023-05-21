const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: false
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    birthdate: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
