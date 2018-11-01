const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create book schema & model
const bookSchema = new Schema({
  cover: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  publisher: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
});

// export model
module.exports = mongoose.model('Book', bookSchema);
