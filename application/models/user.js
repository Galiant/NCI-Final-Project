const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create user schema & model
const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  confirmpassword: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  secondaddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true }
});

// export model
module.exports = mongoose.model('User', userSchema);
