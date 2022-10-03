"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearMemberWorkDays = exports.deleteWorkDay = exports.getDuplicateWorkDates = exports.createWorkDay = exports.getMemberSchedule = void 0;
const schemas_1 = require("./schemas");
// Get payments by teamMemberID
const getMemberSchedule = (id) => {
    return schemas_1.workDay.find({ teamMemberId: id });
};
exports.getMemberSchedule = getMemberSchedule;
// Create a new payment
const createWorkDay = (newDate) => {
    return schemas_1.workDay.create(newDate);
};
exports.createWorkDay = createWorkDay;
// Check for existing workDate for a team member
const getDuplicateWorkDates = (teamMemberId, wDate) => {
    return schemas_1.workDay.find({ teamMemberId: teamMemberId, workDate: wDate });
};
exports.getDuplicateWorkDates = getDuplicateWorkDates;
// Delete a work day
const deleteWorkDay = (teamMemberId, wDate) => {
    return schemas_1.workDay.findOneAndDelete({
        teamMemberId: teamMemberId,
        workDate: wDate,
    });
};
exports.deleteWorkDay = deleteWorkDay;
// Delete all work days of a team member
const clearMemberWorkDays = (id) => {
    return schemas_1.workDay.deleteMany({ teamMemberId: id });
};
exports.clearMemberWorkDays = clearMemberWorkDays;
