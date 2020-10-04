const util = require("util");
const client = require("../../db");

exports.index = (req, res) => {
  res.status(200).json({ decoded: req.user });
};

exports.addWord = async (req, res) => {
  const { userId } = req.user;
  const { type } = req.query;

  try {
    await client.query(
      `UPDATE "user"
      SET ${type} = ${type} || $1::jsonb
      WHERE id = $2`,
      [JSON.stringify(req.body), userId]
    );
    return res.status(200).send("Add successful");
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error when add word");
  }
};

exports.removeFromListWord = async (req, res) => {
  const { userId } = req.user;
  const { type, idx } = req.query;

  try {
    const data = await client.query(
      `SELECT ${type} FROM "user" WHERE id = $1`,
      [userId]
    );

    const listWord = data.rows[0][type];
    const index = listWord.findIndex(
      (e) => e.idx.toString() === idx.toString()
    );

    await client.query(
      `UPDATE "user"
      SET ${type} = ${type}::jsonb - ${index}
      WHERE id = $1`,
      [userId]
    );

    return res.status(200).send("Remove successful");
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error when remove word from list word");
  }
};

exports.getListWord = async (req, res) => {
  const { userId } = req.user;

  try {
    const dataUnknown = await client.query(
      `SELECT unknown FROM "user" WHERE id = $1`,
      [userId]
    );
    const dataKnown = await client.query(
      `SELECT known FROM "user" WHERE id = $1`,
      [userId]
    );
    return res.status(200).json({
      unknown: dataUnknown.rows[0].unknown,
      known: dataKnown.rows[0].known,
    });
  } catch (err) {
    return res.status(400).send("Error when get list word");
  }
};
