const bcrypt = require("bcrypt");

const checkValidPassword = ({ password, hashedPassword }) => bcrypt.compareSync(password, hashedPassword);

module.exports = {
  checkValidPassword,
};

