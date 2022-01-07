const Route = get.modules("Route");
const Authenticator = get.modules("Authenticator");
const TokenStorageNode = get.modules("Class/TokenStorageNode");

module.exports = class Data extends Route {

    constructor() {
        super();
    }

    async UpdateTokenStorage(request) {

        await TokenStorageNode.update(
            {
                token: request.TokenStorageData.token
            },
            {
                status: 'logged_out'
            }
        )

    }

    get Handler() {
        return async (request, h) => {

            await Authenticator(request, h);

            await this.UpdateTokenStorage(request, h);

            h.state('TS_NODE_TK', '');

            return {
                statusCode: 200,
                message: "Logged Out"
            };
        }
    }

    get Path() {
        return "/logout";
    }

    get Method() {
        return ["POST"];
    }

    get Base() {
        return '/api/user';
    }

}