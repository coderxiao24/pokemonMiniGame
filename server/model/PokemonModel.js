const mongoose = require("mongoose");

const pokemonType = {
  id: Number, //全国图鉴序号
  id_str: String, //全国图鉴
  name: String, //中文名称
  name_en: String, //英文名称
  name_jp: String, //日文名称
  height: Number, //身高
  weight: Number, //体重
  type1: String, //第一属性
  type2: String, //第二属性
  ability1: String, //特性一
  ability2: String, //特性二
  abilityHide: String, //隐藏特性
  ability1_desc: String, //特性一描述
  ability2_desc: String, //特性二描述
  abilityHide_desc: String, //隐藏特性描述
  generation: Number, //时代
  catchRate: String, //捕捉概率（满HP情况下使用普通球）
  desc: String, //宝可梦描述
  chain: String, //进化链
  stat: String, //种族值，分别为 HP,攻击,防御,特攻,特防,速度
  gif: String, //宝可梦动图
  normal: String, //宝可梦正常图片
  pixel: String, //宝可梦像素图
  forward: String, // 宝可梦精灵图 - 正面
  back: String, //宝可梦精灵图 - 背面
  "shiny-forward": String, //宝可梦精灵图 - 正面（闪光）
  "shiny-back": String, //宝可梦精灵图 - 背面（闪光）
};

const PokemonModel = mongoose.model(
  "pokemon",
  new mongoose.Schema(pokemonType)
);

module.exports = PokemonModel;
