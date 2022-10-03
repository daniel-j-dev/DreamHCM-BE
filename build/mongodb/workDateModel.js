"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWorkDay = exports.getDuplicateWorkDates = exports.createWorkDay = exports.getMemberSchedule = void 0;
const schemas_1 = require("./schemas");
// Get payments by teamMemberID
const getMemberSchedule = (id) => {
    return schemas_1.workDate.find({ teamMemberId: id });
};
exports.getMemberSchedule = getMemberSchedule;
// Create a new payment
const createWorkDay = (newDate) => {
    return schemas_1.workDate.create(newDate);
};
exports.createWorkDay = createWorkDay;
// Check for existing workDate for a team member
const getDuplicateWorkDates = (teamMemberId, wDate) => {
    return schemas_1.workDate.find({ teamMemberId: teamMemberId, workDate: wDate });
};
exports.getDuplicateWorkDates = getDuplicateWorkDates;
// Delete a work day
const deleteWorkDay = (teamMemberId, wDate) => {
    return schemas_1.workDate.findOneAndDelete({
        teamMemberId: teamMemberId,
        workDate: wDate,
    });
};
exports.deleteWorkDay = deleteWorkDay;
