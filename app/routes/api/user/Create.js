const Route = get.modules("Route");
const JOI = require("joi");
const Boom = require("@hapi/boom");
const User = get.modules("Class/User");

module.exports = class Create extends Route {

    constructor() {
        super();
    }

    get PayloadSchema() {
        const Schema = JOI.object({
            email: JOI.string().email().required(),
            username: JOI.string().required(),
            password: JOI.string().required().min(8)
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

    async CheckExistingUser(request) {

        // Username search
        const UsernameSearch = await User.get({
            username: request.UserData.username
        })

        if (UsernameSearch != null) {
            throw Boom.badRequest("Username already exists");
        }

        // Email search
        const EmailSearch = await User.get({
            email: request.UserData.email
        })

        if (EmailSearch != null) {
            throw Boom.badRequest("Email is already Registered");
        }

        return;
    }

    async CreateUser(request) {

        const CreatedUser = await User.create(request.UserData);

        return CreatedUser;
    }

    InitiateData(request) {
        let UserData = {};

        UserData.username = request.payload.username;
        UserData.email = request.payload.email;
        UserData.password = User.hashPassword(request.payload.password);
        UserData.createdBy = request.info.remoteAddress;
        UserData.id = random(32);
        UserData.info = {};

        UserData.info.USER_SYSTEM_ID = request.info.id;

        request.UserData = UserData;

        return;
    }

    get Handler() {
        return async (request, h) => {

            this.ValidatePayload(request);

            this.InitiateData(request);

            await this.CheckExistingUser(request);

            await this.CreateUser(request);

            return {
                statusCode: 201,
                message: "User Created",
                data: {
                    id: request.UserData.id,
                    username: request.UserData.username,
                    email: request.UserData.email
                }
            };
        }
    }

    get Path() {
        return "/create";
    }

    get Method() {
        return ["POST"];
    }

    get Base() {
        return '/api/user';
    }
}