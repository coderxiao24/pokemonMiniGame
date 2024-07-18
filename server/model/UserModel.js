const mongoose = require("mongoose");

const userType = {
  avatar: String,
  nickname: String,
  username: String,
  password: String,
  age: Number,
  gender: String,
  ad: Number,
  ballNum: Number,
  money: Number,
  pokemons: Array,
};

const UserModel = mongoose.model("user", new mongoose.Schema(userType));

module.exports = UserModel;
