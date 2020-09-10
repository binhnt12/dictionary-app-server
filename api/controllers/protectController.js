const util = require("util");
// const utils = require("../utils");
const db = require("../../db");

const query = util.promisify(db.query).bind(db);

exports.index = (req, res) => {
  res.status(200).json({ decoded: req.user });
};

exports.addWord = async (req, res) => {
  const { userId } = req.user;
  try {
    await query("UPDATE user SET list_word = ? WHERE id = ?", [
      JSON.stringify(req.body),
      userId,
    ]);
    return res.status(200).send("Add successful");
  } catch (err) {
    return res.status(400).send("Error when add word");
  }
};
