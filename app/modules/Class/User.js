const $User = get.models("User");
const cryptoJs = require("crypto-js");
const hashIt = get.modules("hashIt");
var jwt = require('jsonwebtoken');

const JWT_ACCESS_TOKEN_SECRET = env("JWT_ACCESS_TOKEN_SECRET");
const JWT_REFRESH_TOKEN_SECRET = env("JWT_REFRESH_TOKEN_SECRET");

if (JWT_ACCESS_TOKEN_SECRET === undefined || JWT_REFRESH_TOKEN_SECRET === undefined) {
    throw new Error("Missing JWT Configration");
}


class User {

    constructor(id) {
        this.id = id;
    }


    get data() {
        return new Promise(async (resolve) => {

            const user = await $User.findOne({
                id: this.id
            });

            return resolve(user);

        })
    }

    static async create(data) {
        const user = new $User(data);

        await user.save()

        return user;
    }

    static async get(data) {
        const user = await $User.findOne(data);
        return user;
    }

    static async getMany(data) {
        const users = await $User.find(data);
        return users;
    }

    static async delete(data) {
        const user = await $User.findOneAndDelete(data);
        return user;
    }

    static hashPassword(password) {
        const hash = cryptoJs.SHA256(password).toString();
        return hash;
    }

    static comparePassword(password, hash) {
        const newHash = User.hashPassword(password);
        if (newHash === hash) {
            return true;
        }
        return false;
    }

    static async update(find, data) {
        const user = await $User.findOneAndUpdate(find, {
            $set: data
        });
        return user;
    }

    static hidePartialEmail(email) {
        return email.replace(/(.{2})(.*)(?=@)/,
            function (gp1, gp2, gp3) {
                for (let i = 0; i < gp3.length; i++) {
                    gp2 += "*";
                } return gp2;
            });
    }

    static GenerateDataForJWT(user) {

        let Data = {};

        Data.username = user.username;
        Data.email = user.email;
        Data.verification = user.verification;
        Data.id = user.id;
        Data.JWT_ID = random(32);
        Data.JWT_HASH = hashIt(Data);

        return Data;
    }

    static generateToken(data) {
        const ACCESS_TOKEN_EXPIRE_TIME = env("ACCESS_TOKEN_EXPIRE_TIME") || '1h';

        const accessToken = jwt.sign(data, JWT_ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRE_TIME });
        const refreshToken = jwt.sign(data, JWT_REFRESH_TOKEN_SECRET);

        return {
            accessToken,
            refreshToken
        }
    }

    static GenerateAvatarLink(id) {
        const seed = hashIt(id);
        let url = `https://avatars.dicebear.com/api/identicon/${seed}.png`
        return url;
    }

}

module.exports = User;