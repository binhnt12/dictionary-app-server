const sql = require("../db");

// constructor
const User = function (user) {
  this.username = user.username;
  this.password = user.password;
};

module.exports = User;
