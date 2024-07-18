const PokemonService = require("../services/PokemonService");

const PokemonController = {
  init: async (req, res) => {
    await PokemonService.init();
    res.send({
      ok: 1,
      message: "数据库初始化成功!",
    });
  },
  findById: async (req, res) => {
    const data = await PokemonService.findById(req.params.id);
    res.send({
      ok: 1,
      message: "查询成功!",
      data: req.params.id ? data : data.length,
    });
  },
};

module.exports = PokemonController;
