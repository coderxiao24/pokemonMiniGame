import axios from "@/utils/http";

/**
 * 注册用户
 * @param {object} data
 * @return {object} 结果
 * @author 楷炫
 */
export function addUser(data) {
  return axios({ method: "post", url: "/users", data });
}

/**
 * 登录
 * @param {object} data
 * @return {object} 结果
 * @author 楷炫
 */
export function login(data) {
  return axios({ method: "post", url: "/users/login", data });
}

/**
 * 查询用户
 * @param {object} data
 * @return {object} 结果
 * @author 楷炫
 */
export function getUser(params) {
  return axios({ method: "get", url: "/users", params });
}

/**
 * 编辑用户信息
 * @param {object} data
 * @return {object} 结果
 * @author 楷炫
 */
export function editUser(data) {
  return axios({ method: "post", url: "/users/editUser", data });
}
/**
 * 放生宝可梦
 * @param {object} data
 * @return {object} 结果
 * @author 楷炫
 */
export function setFreePokemon(data) {
  return axios({ method: "post", url: "/users/setFree", data });
}
