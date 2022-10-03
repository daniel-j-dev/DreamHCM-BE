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
const workDateModel_1 = require("../mongodb/workDateModel");
const teamMemberModel_1 = require("../mongodb/teamMemberModel");
const express_validator_1 = require("express-validator");
// Setup Router
const router = express_1.default.Router();
// Create a work day
router.post("/schedule", tokenUtils_1.verifyToken, (0, express_validator_1.body)("teamMemberId").isString(), (0, express_validator_1.body)("workDate").isISO8601(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate req.body ...
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        // Check if workDate already exists for this user
        const dupes = yield (0, workDateModel_1.getDuplicateWorkDates)(req.body.teamMemberId, req.body.workDate);
        if (dupes.length > 0) {
            res.status(400).send("Work date has already been scheduled.");
            return;
        }
        // Check if teamMemberId is valid in teamMembers
        const foundMember = yield (0, teamMemberModel_1.getTeamMemberById)(req.body.teamMemberId);
        if (!foundMember) {
            res.status(404).send("Team member with matching ID was not found.");
            return;
        }
        // Create
        const newWorkDay = {
            teamMemberId: req.body.teamMemberId,
            workDate: req.body.workDate,
        };
        (0, workDateModel_1.createWorkDay)(newWorkDay)
            .then(() => {
            res.status(201).send("Created work day successfully!");
        })
            .catch((error) => {
            console.log(error);
            res.status(500).send("Database error.");
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Server error.");
    }
}));
// Get schedule by teamMemberID
router.get("/schedule", tokenUtils_1.verifyToken, (req, res) => {
    var _a;
    if (!((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.teamMemberId)) {
        res
            .status(400)
            .send("Please provide a teamMemberId in the request params.");
        return;
    }
    // Find payments
    (0, workDateModel_1.getMemberSchedule)(req.query.teamMemberId)
        .then((found) => {
        if (!found) {
            res.status(404).send("No schedule found for this member.");
            return;
        }
        res.status(200).send(found);
    })
        .catch((err) => {
        console.log(err);
        res.status(500).send("Database error.");
    });
});
exports.default = router;
