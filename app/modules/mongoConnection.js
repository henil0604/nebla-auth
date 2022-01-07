const mongoose = require('mongoose');
const Prefix = "[MONGO]"

const mongoConnection = async () => {
    const ConnectionString = env("MONGO_CONNECTION_STRING") || "mongodb://localhost:27017";

    let Connection;

    try {
        log("Initializing Mongo Connection", undefined, Prefix);
        Connection = await mongoose.connect(ConnectionString);
        Connection = Connection.connections[0];
        log("Mongo Connection Initialized", "success", Prefix);
    } catch (e) {
        log("Failed to Connect MongoDB... Retrying...", "error", Prefix);
        await sleep(3000);
        return await mongoConnection();
    }

    return Connection;
}

module.exports = mongoConnection;