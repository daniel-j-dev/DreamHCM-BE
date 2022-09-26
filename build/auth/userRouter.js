"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Create a user account
router.post('/user', (req, res) => {
    console.log(req.body);
    res.send("Hello world!");
});
exports.default = router;
