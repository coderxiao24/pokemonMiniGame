var express = require("express");
var router = express.Router();

const UsersController = require("../controllers/UsersController");

// 初始化数据库
router.post("/", UsersController.add);
router.get("/", UsersController.getUser);

router.post("/editUser", UsersController.editUser);
router.post("/setFree", UsersController.setFree);

router.post("/login", UsersController.login);

module.exports = router;
