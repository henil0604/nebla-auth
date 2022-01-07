// Setting Globals
globalThis.env = require("@helper-modules/env");
globalThis.log = require("@helper-modules/log");
globalThis.sleep = require("@helper-modules/sleep");
globalThis.random = require("@helper-modules/random");
globalThis.$path = require("path");
globalThis.$fs = require("fs");
globalThis.$ROOT = require("app-root-path").path;

globalThis.get = (path, root = $ROOT) => {
    const modPath = $path.join(root, path);
    const mod = require(modPath);
    return mod;
}

globalThis.get.__proto__.modules = (path) => {
    return globalThis.get(path, `${$ROOT}/app/modules/`);
}

globalThis.get.__proto__.extensions = (path) => {
    return globalThis.get(path, `${$ROOT}/app/extensions/`);
}

globalThis.get.__proto__.routes = (path) => {
    return globalThis.get(path, `${$ROOT}/app/routes/`);
}

globalThis.get.__proto__.data = (path) => {
    return globalThis.get(path, `${$ROOT}/app/data/`);
}

globalThis.get.__proto__.models = (path) => {
    return globalThis.get(path, `${$ROOT}/app/models/`);
}