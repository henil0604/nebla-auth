const JOI = require("joi");

const ConfigSchema = JOI.object({
    autoRegister: JOI.boolean().default(true),
    type: JOI.string().required()
})

const ValidateConfig = (Config = {}) => {

    const Data = ConfigSchema.validate(Config);

    if (Data.error) {
        throw new Error(Data.error.message);
    }

    return Data.value;
}

class Extension {

    constructor(Config = {}) {
        this.Config = ValidateConfig(Config);

        if (this.Config.autoRegister) {
            this.register();
        }
    }

    register() {
        Server.ext({
            type: this.type,
            method: this.Handler,
            options: this.Options
        })
    }

    get Handler() {
        return () => { }
    }

    get type() {
        return this.Config.type;
    }

    get Options() {
        return {}
    }

}

module.exports = Extension;