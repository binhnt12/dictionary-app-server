const express = require("express");
const protectController = require("../controllers/protectController");
const router = express.Router();

router.get("/", protectController.index);
router.post("/addWord", protectController.addWord);
router.get("/removeFromListWord", protectController.removeFromListWord);
router.get("/getListWord", protectController.getListWord);

module.exports = router;
