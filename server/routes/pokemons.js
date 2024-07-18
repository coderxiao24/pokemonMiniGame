const express = require("express");
const router = express.Router();
const PokemonController = require("../controllers/PokemonController");

// 初始化数据库
router.get("/init", PokemonController.init);
router.get("/:id?", PokemonController.findById);

module.exports = router;
