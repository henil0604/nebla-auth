// Loading Globals
require("./app/modules/loadGlobals");

log("Loading Modules");
// Importing Server
const Server = get("app");

const Initiate = async () => {
    const mongoConnection = get.modules("mongoConnection");
    await mongoConnection();

    log("Initializing Server")

    globalThis.Server = Server;

    // Starting the Server
    await Server.start();

    const InitializeServer = get.modules("InitializeServer");

    InitializeServer();

    log(`Server Running on {${Server.info.uri}}`, "success")

}

// Initiating Server
Initiate();