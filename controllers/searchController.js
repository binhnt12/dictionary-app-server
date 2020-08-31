const db = require("../db");

exports.search = (req, res) => {
  if (!req.query) {
    return res.status(200).json({ notFound: true, message: "Not found word!" });
  }
  db.query(
    "SELECT * FROM tbl_edict WHERE word = ?",
    [req.query.word],
    (err, results) => {
      if (err) {
        return res.status(400).json({ message: err.sqlMessage });
      }

      if (!results[0]) {
        return res
          .status(200)
          .json({ result: { notFound: true, message: "Not found word!" } });
      }

      const removedTags = results[0].detail.slice(
        results[0].detail.indexOf("@"),
        results[0].detail.indexOf("</Q>")
      );
      const text = removedTags.replace(/<br \/>/g, "\n").replace(/\+/g, ":");
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
        result: {
          message: "Success",
          idx: results[0].idx,
          word: results[0].word,
          detail: { splitTwo },
        },
      });
    }
  );
};

exports.searchMultiple = (req, res) => {
  db.query(
    "SELECT * FROM tbl_edict WHERE word LIKE ? LIMIT 5",
    [req.params.word] + "%",
    (err, results) => {
      if (err) {
        return res.status(400).json({ message: err.sqlMessage });
      }

      let words = results;
      for (let i = 0; i < results.length; i++) {
        words[i].idx = results[i].idx;
        words[i].detail = results[i].detail
          .slice(results[i].detail.indexOf("@"), results[i].detail.indexOf(" "))
          .replace(/@/g, "")
          .replace(/<br/g, "")
          .replace(/-/g, " ");
      }

      res.status(200).json({ result: words });
    }
  );
};
