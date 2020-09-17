const util = require("util");
// const utils = require("../utils");
const db = require("../../db");

const query = util.promisify(db.query).bind(db);

exports.index = (req, res) => {
  res.status(200).json({ decoded: req.user });
};

exports.addWord = async (req, res) => {
  const { userId } = req.user;
  const { type } = req.query;
  try {
    await query(
      `UPDATE user 
      SET ${type} = IF(
        ${type} IS NULL OR
        JSON_TYPE(${type}) != 'ARRAY',
        JSON_ARRAY(),
        ${type}
      ),
      ${type} = JSON_ARRAY_APPEND(
        ${type},
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
  const { type, idx } = req.query;
  console.log(idx);
  try {
    const data = await query(`SELECT ${type} FROM user WHERE id = ?`, [userId]);

    const listWord =
      type === "unknown"
        ? JSON.parse(data[0].unknown)
        : JSON.parse(data[0].known);
    console.log(listWord);
    const index = listWord.findIndex(
      (e) => e.idx.toString() === idx.toString()
    );
    await query(
      `UPDATE user SET ${type} = JSON_REMOVE(${type}, '$[?]') WHERE id = ?`,
      [index, userId]
    );

    return res.status(200).send("Remove successful");
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error when remove word from list word");
  }
};

exports.getListWord = async (req, res) => {
  const { userId } = req.user;
  console.log(userId);
  try {
    dataUnknown = await query("SELECT unknown FROM user WHERE id = ?", [
      userId,
    ]);
    dataKnown = await query("SELECT known FROM user WHERE id = ?", [userId]);
    console.log(dataUnknown);
    return res.status(200).json({
      unknown: JSON.parse(dataUnknown[0].unknown),
      known: JSON.parse(dataKnown[0].known),
    });
  } catch (err) {
    return res.status(400).send("Error when get list word");
  }
};
