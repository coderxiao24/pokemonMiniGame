const PokemonModel = require("../model/PokemonModel");

let pokemonData = require("../pokedex-main/pokemon.json");

pokemonData = pokemonData.map((v) => ({
  ...v,
  gif: `/images/gif/${v.id}.gif`,
  normal: `/images/normal/${v.id}.png`,
  pixel: `/images/pixel/${v.id}.png`,
  forward: `/images/sprite/forward/${v.id}.png`,
  back: `/images/sprite/back/${v.id}.png`,
  "shiny-forward": `/images/sprite/shiny-forward/${v.id}.png`,
  "shiny-back": `/images/sprite/shiny-back/${v.id}.png`,
}));

const PokemonService = {
  init: async () => {
    await PokemonModel.deleteMany({});
    return PokemonModel.create(pokemonData);
  },
  findById: async (id) => {
    const params = id ? { id } : {};
    return PokemonModel.find(params);
  },
};

module.exports = PokemonService;
