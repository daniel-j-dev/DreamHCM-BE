"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jwt = require("jsonwebtoken");
// JWT Secret
if (!process.env.JWT_SECRET)
    throw '"JWT_SECRET" not found in process.env';
const secret = process.env.JWT_SECRET;
// Generates a new JWT
const generateToken = (user) => {
    if (!user)
        throw 'Please provide generateToken an "email" and an "_id"';
    const payload = {
        _id: user._id,
        email: user.email,
    };
    const options = {
        expiresIn: "1d",
    };
    return jwt.sign(payload, secret, options);
};
exports.generateToken = generateToken;
// Middleware to verify & decode a JWT
const verifyToken = (req, res, next) => {
    var _a;
    // Check for token
    const token = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
    if (!token) {
        res.status(400).send("User must be signed in. Please provide a token.");
        return;
    }
    // Verify & decode token
    jwt.verify(token, secret, (error, decodedToken) => {
        if (error) {
            res.status(401).json({ you: "Invalid or expired token" });
            return;
        }
        // Add decoded token to request
        req.decodedToken = decodedToken;
        next();
    });
};
exports.verifyToken = verifyToken;
