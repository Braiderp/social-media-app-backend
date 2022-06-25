const validator = require("validator");

module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};

  if (validator.isEmpty(username)) {
    errors.username = "Username must not be empty";
  }
  if (validator.isEmpty(email)) {
    errors.email = "Email must not be empty";
  }
  if (!validator.isEmail(email)) {
    errors.email = "Email invalid";
  }
  if (validator.isEmpty(password)) {
    errors.password = "Password must not be empty";
  }
  if (password != confirmPassword) {
    errors.password = "Password does not match";
  }
  const valid = Object.keys(errors).length < 1;

  return {
    errors,
    valid
  };
};

module.exports.validateLoginInput = (username, password) => {
  const errors = {};

  if (validator.isEmpty(username)) {
    errors.username = "Username must not be empty";
  }
  if (validator.isEmpty(password)) {
    errors.password = "Password must not be empty";
  }
  const valid = Object.keys(errors).length < 1;

  return {
    errors,
    valid
  };
};
