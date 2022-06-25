const { model, Schema } = require("mongoose");

const schema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String
});

module.exports = model("User", schema);
