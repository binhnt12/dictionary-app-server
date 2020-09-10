const express = require("express");
const protectController = require("../controllers/protectController");
const router = express.Router();

router.get("/", protectController.index);
router.post("/addWord", protectController.addWord);

module.exports = router;
