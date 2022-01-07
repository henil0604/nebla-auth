const urlJoin = require("proper-url-join");
const JOI = require("joi");

const ConfigSchema = JOI.object({
    autoCreateRoute: JOI.boolean().default(true)
})

const ValidateConfig = (Config = {}) => {

    const Data = ConfigSchema.validate(Config);

    if (Data.error) {
        throw new Error(Data.error.message);
    }

    return Data.value;
}

class Route {

    constructor(Config = {}) {
        this.Config = ValidateConfig(Config);

        if (this.Config.autoCreateRoute === true) {
            this.createRoute();
        }
    }

    createRoute() {

        const PATH = urlJoin(
            this.Base,
            this.Path,
            { leadingSlash: true, trailingSlash: false }
        );

        Server.route({
            path: PATH,
            method: this.Method,
            handler: this.Handler,
            options: this.Options
        })
    }

    get Base() {
        return '/';
    }

    get Method() {
        return ['GET'];
    }

    get Handler() {
        return (...args) => {
            return 'Hello World!';
        }
    }

    get Options() {
        return {};
    }

}

module.exports = Route