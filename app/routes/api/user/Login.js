const Route = get.modules("Route");
const JOI = require("joi");
const Boom = require("@hapi/boom");
const User = get.modules("Class/User");
const DateFns = require("date-fns");
const RefreshTokenNode = get.modules("Class/RefreshTokenNode");
const TokenStorageNode = get.modules("Class/TokenStorageNode");

module.exports = class Login extends Route {

    constructor() {
        super();
    }

    get PayloadSchema() {
        const Schema = JOI.object({
            email: JOI.string().email().required(),
            password: JOI.string().required()
        })

        return Schema;
    }

    ValidatePayload(request) {
        request.PayloadValidation = false;

        const Payload = this.PayloadSchema.validate(request.payload);

        if (Payload.error) {
            throw Boom.badRequest(Payload.error.message);
        }

        request.payload = Payload.value;
        request.PayloadValidation = true;

        return true;
    }

    async FetchUser(request) {

        const userData = await User.get({
            email: request.payload.email
        });

        if (userData === null) {
            throw Boom.badRequest("User not found");
        }

        const user = new User(userData.id);

        request.UserData = await user.data;

    }

    ComparePassword(request) {

        const isPasswordValid = User.comparePassword(request.payload.password, request.UserData.password);

        if (isPasswordValid === false) {
            throw Boom.badRequest("Incorrect password");
        }

        return;
    }

    async GenerateTokens(request) {

        let Data = User.GenerateDataForJWT(request.UserData);

        let Tokens = User.generateToken(Data)

        request.Tokens = Tokens;
    }

    async StoreToken(request) {

        const { refreshToken } = request.Tokens;

        let Data = {
            refreshToken,
            token: random(64),
            id: request.UserData.id,
            createdAt: new Date,
        }

        Data.expiresAt = DateFns.add(Data.createdAt, {
            days: 10
        })

        const node = await RefreshTokenNode.create(Data);

        return;
    }

    async CheckActiveLogins(request) {

        const UsableRefreshTokenNodes = await RefreshTokenNode.getMany({
            status: "usable"
        });

        if (UsableRefreshTokenNodes.length >= request.UserData.settings.MAX_ACTIVE_LOGINS) {
            throw Boom.badRequest("Too many active logins");
        }

        return;
    }

    async GenerateStorage(request) {

        const Data = {
            refreshToken: request.Tokens.refreshToken,
            accessToken: request.Tokens.accessToken,
            token: random(32)
        }

        const node = await TokenStorageNode.create(Data);

        request.TokenStorageNode = node;

        return node;
    }

    SetCookies(request, h) {

        h.state('TS_NODE_TK', request.TokenStorageNode.token);

        return;
    }


    get Handler() {
        return async (request, h) => {

            this.ValidatePayload(request, h);

            await this.FetchUser(request, h);

            await this.CheckActiveLogins(request, h);

            this.ComparePassword(request, h);

            await this.GenerateTokens(request, h);

            await this.StoreToken(request, h);

            await this.GenerateStorage(request, h);

            this.SetCookies(request, h);

            return {
                statusCode: 200,
                message: "Logged In",
                data: {
                    ...request.Tokens
                }
            };
        }
    }

    get Path() {
        return "/login";
    }

    get Method() {
        return ["POST"];
    }

    get Base() {
        return '/api/user';
    }

}