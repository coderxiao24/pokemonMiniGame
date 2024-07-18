import axios from "@/utils/http";

/**
 * 注册用户
 * @param {object} data
 * @return {object} 结果
 * @author 楷炫
 */
export function getPokemon(id) {
  return axios({ method: "get", url: `/pokemons${id ? "/" + id : ""}` });
}
