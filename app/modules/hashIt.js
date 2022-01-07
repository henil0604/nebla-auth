const cryptoJs = require("crypto-js");

module.exports = (data) => {
    try {
        data = JSON.stringify(data);
    } catch (e) { }

    try {
        data = data.toString()
    } catch (e) { }

    return cryptoJs.SHA256(data).toString();

}