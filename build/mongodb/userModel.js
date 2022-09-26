"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const { user } = require("./schemas");
const createUser = () => {
    console.log(user);
    console.log("User created");
};
exports.createUser = createUser;
