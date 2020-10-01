const db = require("../../db");

exports.search = (req, res) => {
  if (!req.query.word) {
    return res
      .status(200)
      .json({ data: { notFound: true, message: "Not found word!" } });
  }
  word = req.query.word.replace(/ /g, "-");
  db.query("SELECT * FROM tbl_edict WHERE word = ?", [word], (err, results) => {
    if (err) {
      return res.status(400).json({ message: err.sqlMessage });
    }

    if (!results[0]) {
      return res
        .status(200)
        .json({ data: { notFound: true, message: "Not found word!" } });
    }
    console.log("hehe", results[0].detail);

    res.status(200).json({
      data: {
        notFound: false,
        message: "Success",
        idx: results[0].idx,
        word: results[0].word,
        detail: results[0].detail,
      },
    });
  });
};

exports.searchMultiple = (req, res) => {
  if (!req.query.word) {
    return res.status(200).json({ data: { words: [] } });
  }
  word = req.query.word.replace(/ /g, "-");
  db.query(
    "SELECT * FROM tbl_edict WHERE word LIKE ? LIMIT 10",
    [word] + "%",
    (err, results) => {
      if (err) {
        return res.status(400).json({ message: err.sqlMessage });
      }

      let words = results;
      for (let i = 0; i < results.length; i++) {
        words[i].idx = results[i].idx;
        words[i].word = results[i].word.replace(/[-\.]/, " ");
      }

      res.status(200).json({ data: { words } });
    }
  );
};
