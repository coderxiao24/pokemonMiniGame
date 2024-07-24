const UsersService = require("../services/UsersService");
const JWT = require("../utils/JWT");

const UsersController = {
  add: async (req, res) => {
    const data = await UsersService.add(req.body);
    res.send(data);
  },
  getUser: async (req, res) => {
    const data = await UsersService.getUser(req.query);
    res.send({ ok: 1, data });
  },
  getUserTop5: async (req, res) => {
    const data = await UsersService.getUserTop5(req.query);
    res.send({ ok: 1, data });
  },
  login: async (req, res) => {
    const { username, password } = req.body;
    const data = await UsersService.login(username, password);
    if (data.length === 0) {
      res.send({
        ok: 0,
        message: "用户名或密码错误",
      });
    } else {
      //设置token
      const token = JWT.generate(
        {
          _id: data[0]._id,
          username: data[0].username,
        },
        "1d"
      );
      //token返回在header
      res.header("Authorization", token);
      //默认存在内存中。
      res.send({
        ok: 1,
        message: "登录成功",
        data,
      });
    }
  },
  editUser: async (req, res) => {
    const data = await UsersService.editUser(req.body);
    res.send({ ok: 1, data });
  },
  setFree: async (req, res) => {
    const data = await UsersService.setFree(req.body);
    res.send({ ok: 1, data });
  },
};

module.exports = UsersController;
