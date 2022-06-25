const { UserInputError } = require("apollo-server-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");

require("dotenv").config();

const {
  validateRegisterInput,
  validateLoginInput
} = require("../utils/validators");

function generateToken(user) {
  const data = {
    id: user.id,
    email: user.email,
    username: user.username
  };
  return jwt.sign(data, process.env.SECRET, { expiresIn: "10h" });
}
module.exports = {
  Mutation: {
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);
      console.log(valid);
      const user = await User.findOne({ username });

      let isMatch = false;
      if (user) {
        isMatch = await bcrypt.compare(password, user.password);
      }

      if (!user || !isMatch || !valid) {
        throw new UserInputError("invalid credentials", { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token
      };
    },
    async register(
      parent,
      { registerInput: { username, email, password, confirmPassword } },
      context,
      info
    ) {
      const { errors, valid } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new UserInputError("Form is invalid", { errors });
      }
      password = await bcrypt.hash(password, 12);

      const exists = await User.findOne({ username });

      if (exists) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken"
          }
        });
      }

      const user = new User({
        email,
        username,
        password,
        confirmPassword,
        createdAt: new Date().toDateString()
      });

      const res = await user.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token
      };
    }
  }
};
