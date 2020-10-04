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
      const decoded = await utils.verifyJwtToken(token, secretKey);
      req.user = decoded;
      next();
    } catch (err) {
      console.log(err);
      return res.status(401).send("Unauthorized");
    }
  } else {
    return res.status(403).send("No token provided");
  }
};
