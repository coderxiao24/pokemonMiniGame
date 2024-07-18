const crypto = require("crypto");
const { secretKey } = require("../config/MD5SecretKey");

const MD5 = (value) => {
  const hmac = crypto.createHmac("md5", secretKey);
  hmac.update(value);
  return hmac.digest("hex");
};

module.exports = MD5;
