const UserModel = require("../model/UserModel");
const MD5 = require("../utils/MD5");

const UsersService = {
  add: async (data) => {
    const findUsers = await UserModel.find({ username: data.username });
    if (findUsers.length) return { ok: 0, message: "已存在该账号" };

    data.password = MD5(data.password);
    !data.age && (data.age = 18);
    !data.gender && (data.gender = "male");
    !data.avatar && (data.avatar = "/default.png");

    const res = await UserModel.create({
      ...data,
      ad: 1,
      ballNum: 0,
      money: 0,
      pokemons: [],
    });
    return { ok: 1, data: res, message: "注册成功" };
  },
  getUser: (data) => {
    return UserModel.find(data);
  },
  getUserTop5: (data) => {
    const param = {};
    if (data.rankingType == 0) {
      param["money"] = -1;
      return UserModel.find({}).sort({ money: -1 }).limit(5);
    } else {
      return UserModel.aggregate([
        {
          $project: {
            // 按照 pokemons 数组长度计算 length 字段
            pokemonsLength: { $size: "$pokemons" },
            userData: "$$ROOT",
          },
        },
        {
          // 根据 pokemonsLength 降序排序
          $sort: { pokemonsLength: -1 },
        },
        {
          // 限制返回的结果为前 5 条
          $limit: 5,
        },

        {
          // 重构文档，将原始数据放回去
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                "$userData",
                { pokemonsLength: "$pokemonsLength" },
              ],
            },
          },
        },
      ]);
    }
  },
  login: (username, password) => {
    password = MD5(password);
    return UserModel.find({ username, password });
  },
  editUser: (body) => {
    const { _id, data } = body;

    if (data.pokemons) {
      const pokemons = data.pokemons;
      delete data.pokemons;
      return UserModel.updateOne(
        {
          _id,
        },
        { $inc: { ...data }, $push: { pokemons } }
      );
    }

    return UserModel.updateOne(
      {
        _id,
      },
      { $inc: { ...data }, $push: {} }
    );
  },
  setFree: (body) => {
    const { userId, pokemonId } = body;
    return UserModel.updateOne(
      {
        _id: userId,
      },
      {
        $pull: {
          pokemons: {
            _id: pokemonId,
          },
        },
      }
    );
  },
};

module.exports = UsersService;
