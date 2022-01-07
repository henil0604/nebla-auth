const Route = get.modules("Route");
const Authenticator = get.modules("Authenticator");


module.exports = class Data extends Route {

    constructor() {
        super();
    }

    get Handler() {
        return async (request, h) => {

            await Authenticator(request, h);

            let Data = {};

            Data.username = request.UserData.username;
            Data.email = request.UserData.email;
            Data.verification = request.UserData.verification;
            Data.id = request.UserData.id;
            Data.createdAt = request.UserData.createdAt;
            Data.createdBy = request.UserData.createdBy;
            Data.settings = request.UserData.settings;

            return Data;
        }
    }

    get Path() {
        return "/data";
    }

    get Method() {
        return ["GET", "POST"];
    }

    get Base() {
        return '/api/user';
    }

}