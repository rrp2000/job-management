const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const validator = require("../validator/validator");
const jwt = require("jsonwebtoken");


const register = async (req, res) => {
  try {
    const userDetails = req.body;
    let { fName, lName, email, password } = userDetails;

    //validations for fName
    if (!validator.validateString(fName))
      return res
        .status(400)
        .send({ status: false, message: `First Name is not valid.` });
    if (!validator.checkOnlyLetters(fName))
      return res
        .status(400)
        .send({
          status: false,
          message: `First Name can't contain number or special character.`,
        });

    //validations for lName
    if (!validator.validateString(lName))
      return res
        .status(400)
        .send({ status: false, message: `Last Name is not valid.` });
    if (!validator.checkOnlyLetters(lName))
      return res
        .status(400)
        .send({
          status: false,
          message: `Last Name can't contain number or special character.`,
        });

    //validations for email
    if (!validator.validateString(email))
      return res
        .status(400)
        .send({ status: false, message: `Email is not valid.` });
    if (!validator.validateEmail(email))
      return res
        .status(400)
        .send({ status: false, message: `Enter a valid Email format.` });
    if (await userModel.findOne({ email }))
      return res
        .status(400)
        .send({ status: false, message: `Email already exists.` });

    //validations for password
    if (!validator.validateString(password))
      return res
        .status(400)
        .send({ status: false, message: `Password is not valid.` });
    if (password.length < 8 || password.length > 15)
      return res
        .status(400)
        .send({ status: false, message: `Password must be between 8 and 15` });

    //hashing password
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    userDetails.password = hashPassword;

    const newUser = await userModel.create(userDetails);
    return res
      .status(201)
      .send({
        status: true,
        message: `User Created Successfully`,
        data: newUser,
      });
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

//login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user)
      return res
        .status(401)
        .send({ status: false, message: "Invalid email" });

    console.log(await bcrypt.compare(password, user.password))
    if (!(await bcrypt.compare(password, user.password)))
      return res
        .status(401)
        .send({ status: false, message: "Invalid Credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    delete user.password;

    return res
      .status(200)
      .send({ status: true, message: `Login Successfully`, token });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

module.exports = {
  register,
  login
};
