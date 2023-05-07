const bcrypt = require("bcrypt");

const checkValidPassword = ({ password, hashedPassword }) => bcrypt.compareSync(password, hashedPassword);

module.exports = {
  checkValidPassword,
};

// te quedaste en 43:38
