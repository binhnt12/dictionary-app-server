require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = require("../../db");

const saltRounds = parseInt(process.env.SALT_ROUNDS_BCRYPT) || 10;
const secretToken = process.env.SECRET_TOKEN;

exports.signUp = async (req, res) => {
  const { username, password, rePassword } = req.body;

  if (!(username && password && rePassword)) {
    return res.status(400).send("Điền đầy đủ thông tin.");
  }
  if (password !== rePassword) {
    return res.status(400).send("Không khớp mật khẩu.");
  }

  try {
    const selectedUser = await client.query(
      `SELECT * FROM "user" WHERE username = $1`,
      [username]
    );
    if (selectedUser.rows.length > 0)
      return res.status(400).send("User đã tồn tại");

    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        res.status(400).send("Error when hash password");
      }

      const data = await client.query(
        `
        INSERT INTO "user" (username, password)
        VALUES ($1, $2)
        RETURNING id
      `,
        [username, hash]
      );

      const token = jwt.sign({ userId: data.rows[0].id }, secretToken);
      if (data)
        return res.status(200).json({
          username,
          token,
        });
    });
  } catch (err) {
    return res.status(400).send("Lỗi khi tạo user.");
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const selectedUser = await client.query(
    `SELECT * FROM "user" WHERE username = $1`,
    [username]
  );

  if (!(username && password)) {
    return res.status(400).send("Điền đầy đủ thông tin.");
  }
  if (selectedUser.rows.length === 0) {
    return res.status(401).send("Sai tên tài khoản hoặc mật khẩu.");
  }

  bcrypt.compare(password, selectedUser.rows[0].password, (err, result) => {
    if (result) {
      try {
        const token = jwt.sign(
          { userId: selectedUser.rows[0].id },
          secretToken
        );

        res.status(200).json({
          username: selectedUser.rows[0].username,
          token,
        });
      } catch (error) {
        console.log(error);
        res.status(400).send("Can't validate token");
      }
    } else {
      console.log(err);
      return res.status(401).send("Sai tên tài khoản hoặc mật khẩu.");
    }
  });
};

exports.logout = (req, res) => {
  return res.status(200).send("Logout successful");
};
