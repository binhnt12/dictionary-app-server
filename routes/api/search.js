const express = require("express");
const router = express.Router();

const searchController = require("../../controllers/searchController");

router.get("/single", searchController.search);
router.get("/multiple/word=:word", searchController.searchMultiple);

module.exports = router;
