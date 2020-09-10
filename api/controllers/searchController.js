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

    const removedTags = results[0].detail.slice(
      results[0].detail.indexOf("@"),
      results[0].detail.indexOf("</Q>")
    );
    const text = removedTags
      .replace(/<br \/>/g, "\n")
      .replace(/\+/g, ":")
      .replace(/&amp;/g, "&");
    const splitOne = text.split(/(?=\*)/);
    let splitTwo = [];
    splitTwo[0] =
      splitOne[0].slice(
        splitOne[0].indexOf("/"),
        splitOne[0].indexOf("/", splitOne[0].indexOf("/") + 1)
      ) + "/";
    for (let i = 1; i < splitOne.length; i++) {
      splitTwo[i] = splitOne[i].replace(/\n!/, "<br !/>!").split("<br !/>");
    }

    res.status(200).json({
      data: {
        notFound: false,
        message: "Success",
        idx: results[0].idx,
        word: results[0].word,
        detail: { splitTwo },
      },
    });
  });
};

exports.searchMultiple = (req, res) => {
  console.log(req.query);
  if (!req.query.word) {
    return res.status(200).json({ data: { words: [] } });
  }
  word = req.query.word.replace(/ /g, "-");
  db.query(
    "SELECT * FROM tbl_edict WHERE word LIKE ? LIMIT 5",
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
