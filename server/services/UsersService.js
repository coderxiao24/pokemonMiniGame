const UserModel = require("../model/UserModel");
const MD5 = require("../utils/MD5");

const UsersService = {
  add: async (data) => {
    const findUsers = await UserModel.find({ username: data.username });
    if (findUsers.length) return { ok: 0, message: "已存在该账号" };

    data.password = MD5(data.password);

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
    console.log(data);
    return UserModel.find(data);
  },
  login: (username, password) => {
    password = MD5(password);
    return UserModel.find({ username, password });
  },
  editUser: (body) => {
    const { _id, data } = body;

    console.log(_id, data);

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
