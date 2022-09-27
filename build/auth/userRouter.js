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
const router = express_1.default.Router();
// Get a user by email
router.get("/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.email)) {
        res.status(400).send("An email address is required.");
        return;
    }
    // "password" is excluded by default
    (0, userModel_1.getUserByEmail)(req.body.email)
        .then((allUsers) => {
        res.send(allUsers);
    })
        .catch((err) => {
        res.status(500).send(err);
    });
}));
// Create a user account
router.post("/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    // Check if request is valid (contains email and password)
    if (!((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.email) || !req.body.password) {
        res.status(400).send("An email address and password are required.");
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
        res.status(500).send(err);
    });
}));
exports.default = router;
