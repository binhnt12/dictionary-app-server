require("dotenv").config();

const utils = require("../utils");

const secretKey = process.env.SECRET_TOKEN;

module.exports.requireAuth = async (req, res, next) => {
  let token;
  if (
    req.headers &&
    req.headers.authorization &&
    String(req.headers.authorization.split(" ")[0] === "Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    try {
      // TODO
      // const decoded = await utils.verifyJwtToken(token, secretKey);
      // req.user = decoded;
      req.user = { userId: 13 };
      next();
    } catch (err) {
      // Nếu token tồn tại nhưng không hợp lệ, server sẽ response status code 401 với msg bên dưới
      console.log(err);
      return res.status(401).send("Unauthorized");
    }
  } else {
    return res.status(403).send("No token provided");
  }
};
