// export * as exitCodes from "./exit-codes.js";
// export * as auth from "./auth/index.js";
// export * as ports from "./ports/index.js";

const exitCodes = require("./exit-codes.js");
const auth = require("./auth/index.js");
const ports = require("./ports/index.js");

// export * from exitCodes;
// export * from auth;
// export * from ports;

module.exports = {
    ...exitCodes,
    ...auth,
    ...ports
};
