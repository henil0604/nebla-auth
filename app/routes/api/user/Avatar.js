const Route = get.modules("Route");
const Authenticator = get.modules("Authenticator");
const axios = require("axios");
const User = get.modules("Class/User");

module.exports = class Avatar extends Route {

    constructor() {
        super();
    }

    get Handler() {
        return async (request, h) => {

            await Authenticator(request, h);

            let { url, seed } = User.GenerateAvatarLink(request.UserData.id);

            const response = await axios({
                url,
                responseType: 'arraybuffer' // important
            });

            let buffer = response.data;

            const Response = h.response(buffer);

            Response.type('image/png').bytes(buffer.length).code(200);
            Response.header('Content-Disposition', `attachment; filename=${seed}.png`);

            return Response;
        }
    }

    get Path() {
        return "/avatar";
    }

    get Method() {
        return ["GET", "POST"];
    }

    get Base() {
        return '/api/user';
    }

}