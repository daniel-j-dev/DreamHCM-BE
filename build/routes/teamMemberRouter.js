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
const tokenUtils_1 = require("../auth/tokenUtils");
const teamMemberModel_1 = require("../mongodb/teamMemberModel");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
// Get all team members
router.get("/teammember", tokenUtils_1.verifyToken, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, teamMemberModel_1.getAllTeamMembers)()
        .then((members) => {
        res.status(200).send(members);
    })
        .catch((err) => {
        console.log(err);
        res.status(500).send("Database error");
    });
}));
// Add a new team member
router.post("/teammember", tokenUtils_1.verifyToken, (0, express_validator_1.body)("name").isString().isLength({ min: 1, max: 100 }), (0, express_validator_1.body)("currentPosition").isString().isLength({ min: 1, max: 100 }), (0, express_validator_1.body)("payType").isString().isLength({ min: 1, max: 100 }), (0, express_validator_1.body)("pay").isFloat({ min: 0, max: 1000000000 }), (0, express_validator_1.body)("hireDate").isFloat(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate req.body ...
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    // Create new member
    const newMember = {
        name: req.body.name,
        currentPosition: req.body.currentPosition,
        payType: req.body.payType,
        pay: req.body.pay,
        hireDate: req.body.hireDate,
    };
    (0, teamMemberModel_1.createTeamMember)(newMember)
        .then(() => {
        res.status(201).send("Team member created!");
    })
        .catch((error) => {
        console.log(error);
        res.status(500).send("Database error");
    });
}));
// Update a new team member
router.put("/teammember", tokenUtils_1.verifyToken, (0, express_validator_1.body)("_id").exists(), (0, express_validator_1.body)("name").isString().isLength({ min: 1, max: 100 }), (0, express_validator_1.body)("currentPosition").isString().isLength({ min: 1, max: 100 }), (0, express_validator_1.body)("payType").isString().isLength({ min: 1, max: 100 }), (0, express_validator_1.body)("pay").isFloat({ min: 0, max: 1000000000 }), (0, express_validator_1.body)("hireDate").isFloat(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate req.body ...
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    // Update member
    const updatedMember = {
        _id: req.body._id,
        name: req.body.name,
        currentPosition: req.body.currentPosition,
        payType: req.body.payType,
        pay: req.body.pay,
        hireDate: req.body.hireDate,
    };
    (0, teamMemberModel_1.updateTeamMember)(updatedMember)
        .then((updated) => {
        // Check if updated
        if (!updated) {
            res.status(404).send("Team member with matching ID was not found.");
            return;
        }
        res.status(200).send("Team member was successfully updated!");
    })
        .catch((err) => {
        console.log(err);
        res.status(500).send("Database error");
    });
}));
// Delete a new team member
router.delete("/teammember", tokenUtils_1.verifyToken, (0, express_validator_1.body)("_id").exists(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate req.body ...
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    // Delete team member
    (0, teamMemberModel_1.deleteTeamMember)(req.body._id)
        .then((deleted) => {
        // Check if deleted
        if (!deleted) {
            res.status(404).send("Team member with matching _id was not found.");
            return;
        }
        res.status(200).send("Team member was successfully deleted.");
    })
        .catch((error) => {
        console.log(error);
        res.status(500).send("Database error");
    });
}));
exports.default = router;
