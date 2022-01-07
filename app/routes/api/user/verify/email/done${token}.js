const Route = get.modules("Route");
const Boom = require("@hapi/boom");
const User = get.modules("Class/User");
const JOI = require("JOI");
const EmailVerificationNode = get.modules("Class/EmailVerificationNode");

module.exports = class Done$token extends Route {

    constructor() {
        super();
    }

    async FetchToken(request, h) {
        const NodeData = new EmailVerificationNode(request.token);
        request.NodeData = await NodeData.data;
    }

    async ValidateToken(request, h) {

        if (request.NodeData == null) {
            throw Boom.badRequest("Token not found");
        }

        const expired = EmailVerificationNode.isExpired(request.NodeData);

        if (expired) {
            throw Boom.badRequest("Token expired");
        }

        if (request.NodeData.status !== "pending") {
            throw Boom.badRequest("Token status is not pending");
        }

    }

    async FetchUser(request) {
        const user = new User(request.NodeData.id);

        request.UserData = await user.data;
    }

    async Update(request, h) {

        // Updating User
        const User$ToUpdate = {
            'verification.email': {
                verified: true,
                token: request.NodeData.token
            }
        };
        await User.update(
            {
                id: request.UserData.id
            },
            User$ToUpdate
        )

        // Updating EmailVerificationNode
        const EmailVerificationNode$ToUpdate = {
            status: "used"
        }

        await EmailVerificationNode.update(
            {
                token: request.NodeData.token
            },
            EmailVerificationNode$ToUpdate
        )

    }

    get Handler() {
        return async (request, h) => {

            request.token = request.params.token;

            if (request.token == undefined || request.token == "" || request.token == null) {
                throw Boom.badRequest("Token is required")
            }

            await this.FetchToken(request, h);

            await this.ValidateToken(request, h);

            await this.FetchUser(request, h);

            await this.Update(request, h);

            return {
                statusCode: 200,
                message: "Email verification successful"
            };
        }
    }

    get Path() {
        return "/api/user/verify/email/done/{token}";
    }

    get Method() {
        return ["GET", "POST"];
    }

}