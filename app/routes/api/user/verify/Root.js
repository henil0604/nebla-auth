const Route = get.modules("Route");


module.exports = class Root extends Route {

    constructor() {
        super();
    }

    sayHello(request, h) {
        return `Hello World From /api/user/verify`;
    }

    get Handler() {
        return (...args) => {
            return this.sayHello(...args);
        }
    }

    get Path() {
        return "/";
    }

    get Method() {
        return ["GET", "POST"];
    }

    get Base() {
        return '/api/user/verify';
    }

}