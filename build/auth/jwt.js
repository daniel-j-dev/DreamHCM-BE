"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jwt = require("jsonwebtoken");
const generateToken = (user) => {
    const payload = {
        _id: user._id,
        email: user.email,
    };
    if (!process.env.JWT_SECRET)
        throw '"JWT_SECRET" not found in process.env';
    const secret = process.env.JWT_SECRET;
    const options = {
        expiresIn: "1d",
    };
    return jwt.sign(payload, secret, options);
};
exports.generateToken = generateToken;
