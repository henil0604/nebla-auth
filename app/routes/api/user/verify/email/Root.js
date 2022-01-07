const Route = get.modules("Route");
const Boom = require("@hapi/boom");
const User = get.modules("Class/User");
const EmailVerificationNode = get.modules("Class/EmailVerificationNode");
const DateFns = require("date-fns");
const JOI = require("JOI");
const EnchanceTemplate = get.modules("class/EnhanceTemplate");
const urlJoin = require("proper-url-join");
const SendMail = get.modules("SendMail");

module.exports = class Root extends Route {

    constructor() {
        super();
    }

    get PayloadSchema() {
        const Schema = JOI.object({
            id: JOI.string().required()
        })

        return Schema;
    }

    ValidatePayload(request) {

        const Payload = this.PayloadSchema.validate(request.payload);

        if (Payload.error) {
            throw Boom.badRequest(Payload.error.message);
        }

        request.payload = Payload.value;

        return;
    }

    async CheckUser(request) {
        const user = new User(request.payload.id);

        if (await user.data === null) {
            throw Boom.badRequest("User not found");
        }

        request.UserData = await user.data;

        if (request.UserData.verification.email.verified === true) {
            throw Boom.badRequest("User is already verified");
        }

        return;
    }

    async CheckNode(request) {
        const PendingNodes = await EmailVerificationNode.getPendings({
            id: request.UserData.id
        });

        if (PendingNodes.length >= 3) {
            let Error = Boom.badRequest("There are already three request pending for this user")
            throw Error;
        }

    }

    InitializeData(request) {

        let NodeData = {};

        NodeData.email = request.UserData.email;
        NodeData.token = random(64);
        NodeData.createdAt = new Date();
        NodeData.id = request.UserData.id;
        NodeData.expiresAt = DateFns.add(NodeData.createdAt, {
            hours: 24
        });
        NodeData.info = {};
        NodeData.info.REQUESTED_BY = request.info.remoteAddress;
        NodeData.info.USER_SYSTEM_ID = request.info.id;
        NodeData.status = "pending";

        request.NodeData = NodeData;
        return;
    }

    async CreateNode(request) {
        const createdNode = await EmailVerificationNode.create(request.NodeData);

        return createdNode;
    }

    generateTemplate(request) {
        const verification_link = urlJoin(Server.info.uri, request.path, "/done", request.NodeData.token);

        const Template = new EnchanceTemplate("email-verification.html", {
            username: request.UserData.username,
            verification_link: verification_link
        });

        request.Template = Template.generate();

        return;
    }

    async SendMail(request) {
        await SendMail(
            request.NodeData.email,
            "Email Verification",
            request.Template
        );
    }

    get Handler() {
        return async (request, h) => {

            this.ValidatePayload(request);

            await this.CheckUser(request);

            await this.CheckNode(request);

            this.InitializeData(request);

            await this.CreateNode(request);

            await this.generateTemplate(request);

            this.SendMail(request);

            return {
                statusCode: 201,
                message: "Successfully sent email verification request to the registered email",
                data: {
                    sentTo: User.hidePartialEmail(request.NodeData.email)
                }
            };
        }
    }

    get Path() {
        return "/";
    }

    get Method() {
        return ["POST"];
    }

    get Base() {
        return '/api/user/verify/email';
    }

}