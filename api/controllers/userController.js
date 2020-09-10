require("dotenv").config();

const util = require("util");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../db");
const User = require("../../modals/user");

const saltRounds = parseInt(process.env.SALT_ROUNDS_BCRYPT) || 10;
const secretToken = process.env.SECRET_TOKEN;

const query = util.promisify(db.query).bind(db);

exports.signUp = async (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;

  if (!(username && password)) {
    return res.status(400).send("Please enter full fields.");
  }

  try {
    const selectedUser = await query(
      "SELECT * FROM user WHERE BINARY username = ?",
      [username]
    );
    console.log({ selectedUser });
    if (selectedUser.length > 0)
      return res.status(400).send("User already exists");

    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        res.status(400).send("Error when hash password");
      }

      const newUser = new User({
        username,
        password: hash,
      });

      const data = await query("INSERT INTO user SET ?", newUser);
      console.log(data);

      const token = jwt.sign({ userId: data.insertId }, secretToken);
      console.log(token);
      if (data)
        return res.status(200).json({
          username,
          // userId: data.insertId,
          token,
        });
    });
  } catch (err) {
    return res.status(400).send("Error when create user");
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const selectedUser = await query(
    "SELECT * FROM user WHERE BINARY username = ?",
    [username]
  );
  console.log(selectedUser);

  if (!(username && password)) {
    return res.status(400).send("Please enter full fields.");
  }
  if (selectedUser.length === 0) {
    return res.status(401).send("Invalid email or password.");
  }

  bcrypt.compare(password, selectedUser[0].password, (err, result) => {
    if (result) {
      try {
        const token = jwt.sign({ userId: selectedUser[0].id }, secretToken);
        console.log("id:", selectedUser[0].id);

        res.status(200).json({
          username: selectedUser[0].username,
          token,
          // userId: selectedUser[0].id,
        });
      } catch (error) {
        console.log(error);
        res.status(400).send("Can't validate token");
      }
    } else {
      console.log(err);
      return res.status(401).send("Invalid email or password.");
    }
  });
};

exports.logout = (req, res) => {
  return res.status(200).send("Logout successful");
};
