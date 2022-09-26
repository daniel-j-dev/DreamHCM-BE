"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userModel_1 = require("../mongodb/userModel");
const router = express_1.default.Router();
// Create a user account
router.post("/user", (req, res) => {
    // Check if request is valid (contains username and password)
    // Check if user email already exists...
    // If user doesn't already exist, hash the password...
    // Save new user to DB
    console.log(req.body);
    (0, userModel_1.createUser)();
    res.send("Hello world!");
});
exports.default = router;
