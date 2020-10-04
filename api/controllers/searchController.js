const client = require("../../db");

exports.search = async (req, res) => {
  if (!req.query.word) {
    return res
      .status(200)
      .json({ data: { notFound: true, message: "Not found word!" } });
  }

  word = req.query.word;
  word2 = req.query.word.replace(/ /g, "-");

  try {
    const result = await client.query(
      `SELECT * FROM "tbl_edict" WHERE LOWER(word) = $1 OR LOWER(word) = $2`,
      [word.toLowerCase(), word2.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res
        .status(200)
        .json({ data: { notFound: true, message: "Not found word!" } });
    }

    res.status(200).json({
      data: {
        notFound: false,
        message: "Success",
        idx: result.rows[0].idx,
        word: result.rows[0].word,
        detail: result.rows[0].detail,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
};

exports.searchMultiple = async (req, res) => {
  if (!req.query.word) {
    return res.status(200).json({ data: { words: [] } });
  }

  word = req.query.word.replace(/ /g, "-");

  try {
    const results = await client.query(`
      SELECT * FROM "tbl_edict" 
      WHERE LOWER(word) LIKE '${word.toLowerCase()}%'
      LIMIT 10
    `);

    let words = results.rows;
    for (let i = 0; i < results.rows.length; i++) {
      words[i].idx = results.rows[i].idx;
      words[i].word = results.rows[i].word.replace(/[-\.]/, " ");
    }

    res.status(200).json({ data: { words } });
  } catch (error) {
    console.log(error);
  }
};
