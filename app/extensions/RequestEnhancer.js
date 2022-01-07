const Extension = get.modules("Extension");
const EmailVerificationNode = get.modules("Class/EmailVerificationNode");
const RefreshTokenNode = get.modules("Class/RefreshTokenNode");
const TokenStorageNode = get.modules("Class/TokenStorageNode");
const jwt = require("jsonwebtoken");

const KEYS = {
    ACCESS_TOKEN: env("JWT_ACCESS_TOKEN_SECRET"),
    REFRESH_TOKEN: env("JWT_REFRESH_TOKEN_SECRET"),
}

module.exports = class RequestEnhancer extends Extension {

    constructor() {
        super({
            type: 'onRequest'
        });
    }

    async MongoEnchancer() {

        // CHECKING FOR 'email-verifications'

        const EmailVerificationPendingNodes = await EmailVerificationNode.getPendings({});

        await EmailVerificationPendingNodes.forEach(async node => {

            if (!EmailVerificationNode.isExpired(node)) return;

            await EmailVerificationNode.update({
                token: node.token
            }, {
                status: "expired"
            })

        })

        // CHECKING FOR 'refresh-tokens'

        const RefreshTokenUsabelNodes = await RefreshTokenNode.getMany({
            status: 'usable'
        });

        await RefreshTokenUsabelNodes.forEach(async node => {

            if (!RefreshTokenNode.isExpired(node)) return;

            await RefreshTokenNode.update({
                token: node.token
            }, {
                status: "expired"
            })

        })


    }

    get Handler() {
        return async (request, h) => {

            await this.MongoEnchancer();

            return h.continue;
        }
    }


}