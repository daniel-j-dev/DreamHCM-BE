"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userModel_1 = require("../mongodb/userModel");
const bcrypt = require("bcryptjs");
const tokenUtils_1 = require("../auth/tokenUtils");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
// Get a user by email
router.get("/user", tokenUtils_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.email)) {
        res.status(400).send("An email address is required.");
        return;
    }
    // "password" is excluded by default
    (0, userModel_1.getUserByEmail)(req.body.email)
        .then((usr) => {
        res.send(usr);
    })
        .catch((err) => {
        console.log(err);
        res.status(500).send("Database error");
    });
}));
// Create a user account
router.post("/user/signup", (0, express_validator_1.body)("email").isEmail().isLength({ min: 1, max: 500 }), (0, express_validator_1.body)("password").isLength({ min: 6, max: 500 }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check for problems with "email" and "password"
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    // Check if user email already exists...
    const foundUser = yield (0, userModel_1.getUserByEmail)(req.body.email);
    if (foundUser) {
        res.status(400).send("User with matching email already exists.");
        return;
    }
    // If user doesn't already exist, create the new user object...
    const newUser = {
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 12),
    };
    // Save new user to DB
    yield (0, userModel_1.createUser)(newUser)
        .then(() => {
        res.status(201).send("Account successfully created!");
    })
        .catch((err) => {
        console.log(err);
        res.status(500).send("Database error");
    });
}));
// Sign in
router.post("/user/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    // Check for email and password
    if (!((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.email) || !req.body.password) {
        res.status(400).send("An email address and password are required.");
        return;
    }
    // Check if user email exists in DB
    const foundUser = yield (0, userModel_1.UNSAFE_getUserByEmail)(req.body.email);
    if (!foundUser) {
        res.status(401).send("No user with that email was found.");
        return;
    }
    // Check if the request password matches with the DB password hash
    if (!bcrypt.compareSync(req.body.password, foundUser.password)) {
        res.status(401).send("Password is incorrect.");
        return;
    }
    // Generate and send a JWT
    const newToken = (0, tokenUtils_1.generateToken)({
        _id: foundUser._id,
        email: foundUser.email,
    });
    res.status(200).send(newToken);
}));
exports.default = router;
