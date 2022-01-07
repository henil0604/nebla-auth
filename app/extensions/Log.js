const Extension = get.modules("Extension");


module.exports = class Log extends Extension {

    constructor() {
        super({
            type: 'onRequest'
        });
    }

    logIt(request) {
        const Method = request.method.toUpperCase();

        log(`{${Method}} ${request.path}`)
    }

    get Handler() {
        return (request, h) => {
            this.logIt(request)

            return h.continue;
        }
    }


}