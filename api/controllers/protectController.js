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
    await query(
      `UPDATE user 
      SET list_word = IF(
        list_word IS NULL OR
        JSON_TYPE(list_word) != 'ARRAY',
        JSON_ARRAY(),
        list_word
      ),
      list_word = JSON_ARRAY_APPEND(
        list_word,
        '$',
        CAST(? AS JSON)
      )
      WHERE id = ?`,
      [JSON.stringify(req.body), userId]
    );
    return res.status(200).send("Add successful");
  } catch (err) {
    return res.status(400).send("Error when add word");
  }
};

exports.removeFromListWord = async (req, res) => {
  const { userId } = req.user;
  const { word } = req.query;
  try {
    const data = await query("SELECT list_word FROM user WHERE id = ?", [
      userId,
    ]);

    const listWord = JSON.parse(data[0].list_word);
    const index = listWord.findIndex((e) => e.word === word);

    await query(
      `UPDATE user SET list_word = JSON_REMOVE(list_word, '$[?]') WHERE id = ?`,
      [index, userId]
    );

    return res.status(200).send("Remove successful");
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error when remove word from list word");
  }
};

exports.getListWord = async (req, res) => {
  console.log(111);
  const { userId } = req.user;
  console.log(userId);
  try {
    data = await query("SELECT list_word FROM user WHERE id = ?", [userId]);
    console.log(data);
    return res.status(200).json({ listWord: JSON.parse(data[0].list_word) });
  } catch (err) {
    return res.status(400).send("Error when get list word");
  }
};
