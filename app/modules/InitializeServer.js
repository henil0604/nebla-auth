
const InitializeServer = () => {

    const Routes = get.data("routes");

    Routes.forEach(Route => {
        new Route()
    });

    const Extensions = get.data("extensions");

    Extensions.forEach(Extension => {
        new Extension()
    })


}

module.exports = InitializeServer;