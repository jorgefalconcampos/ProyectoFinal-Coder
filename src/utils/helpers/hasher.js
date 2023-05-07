const bcrypt = require("bcrypt");

const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

module.exports = {
  createHash,
};
