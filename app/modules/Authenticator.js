const Boom = require("@hapi/boom");
const jwt = require("jsonwebtoken");
const User = get.modules("Class/User");
const TokenStorageNode = get.modules("Class/TokenStorageNode");
const RefreshTokenNode = get.modules("Class/RefreshTokenNode");

const KEYS = {
    ACCESS_TOKEN: env("JWT_ACCESS_TOKEN_SECRET"),
    REFRESH_TOKEN: env("JWT_REFRESH_TOKEN_SECRET"),
}

const Authenticator = async (request, h) => {

    request.AUTHENTICATED = false;

    const TokenStorageToken = request.state.TS_NODE_TK;

    if (TokenStorageToken == undefined || TokenStorageToken == null || TokenStorageToken == "") {
        throw Boom.unauthorized();
    }


    this.FetchTokenStorageNode = async () => {

        const StorageNode = new TokenStorageNode(TokenStorageToken);

        request.TokenStorageNodeData = await StorageNode.data;

        if (request.TokenStorageNodeData === null) {
            throw Boom.unauthorized()
        }

        if (request.TokenStorageNodeData.status !== 'usable') {
            throw Boom.unauthorized();
        }

        return;
    }

    this.RefreshAccessToken = async () => {

        request.UserData = new User(request.VALIDATION.refreshToken.id);

        request.UserData = await request.UserData.data;

        let Data = User.GenerateDataForJWT(request.UserData);

        const Tokens = User.generateToken(Data);

        await TokenStorageNode.update(
            {
                token: TokenStorageToken
            },
            {
                accessToken: Tokens.accessToken
            }
        )

    }

    this.CheckRefreshToken = async () => {
        const node = await RefreshTokenNode.get({
            refreshToken: request.TokenStorageNodeData.refreshToken
        });

        if (node == null) {
            request.VALIDATION.refreshToken = null;
            return;
        }

        const isExpired = RefreshTokenNode.isExpired(node);

        if (isExpired) {
            request.VALIDATION.refreshToken = null;
            return;
        }

        await this.RefreshAccessToken();

        await Authenticator(request, h)
    }

    this.FetchUser = async () => {
        const userId = request.VALIDATION.accessToken.id;

        const user = new User(userId);

        request.UserData = await user.data;
        return;
    }

    this.FetchTokenStorage = async () => {
        const storage = new TokenStorageNode(TokenStorageToken);

        request.TokenStorageData = await storage.data;
    }


    // STARTS HERE

    await this.FetchTokenStorageNode();

    request.VALIDATION = {
        accessToken: null,
        refreshToken: null,
    }

    try {

        request.VALIDATION.accessToken = await jwt.verify(
            request.TokenStorageNodeData.accessToken,
            KEYS.ACCESS_TOKEN
        );

    } catch (e) {
        request.VALIDATION.accessToken = null;
    }

    try {
        request.VALIDATION.refreshToken = await jwt.verify(
            request.TokenStorageNodeData.refreshToken,
            KEYS.REFRESH_TOKEN
        );
    } catch (e) {
        request.VALIDATION.refreshToken = null;
    }

    if (request.VALIDATION.accessToken === null) {

        if (request.VALIDATION.refreshToken !== null) {
            await this.CheckRefreshToken();
        }
    }

    if (request.VALIDATION.accessToken === null || request.VALIDATION.refreshToken === null) {
        throw Boom.unauthorized();
    }

    // Setting UP VARIABLES
    await this.FetchUser();
    await this.FetchTokenStorage();
    request.VALIDATION == undefined;
    request.TokenStorageNodeData == undefined;
    request.UserData == undefined;
    request.AUTHENTICATED = true;

    return { request, h };
}


module.exports = Authenticator;