"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTeamMember = exports.updateTeamMember = exports.createTeamMember = exports.getTeamMemberById = exports.getAllTeamMembers = void 0;
const schemas_1 = require("./schemas");
// Get all team members
const getAllTeamMembers = () => {
    return schemas_1.teamMember.find({});
};
exports.getAllTeamMembers = getAllTeamMembers;
// Get team member by "_id"
const getTeamMemberById = (id) => {
    return schemas_1.teamMember.findOne({ _id: id });
};
exports.getTeamMemberById = getTeamMemberById;
// Create a new team member
const createTeamMember = (member) => {
    return schemas_1.teamMember.create(member);
};
exports.createTeamMember = createTeamMember;
// Update a team member
const updateTeamMember = (modifiedMember) => {
    return schemas_1.teamMember.findOneAndUpdate({ _id: modifiedMember._id }, modifiedMember);
};
exports.updateTeamMember = updateTeamMember;
// Delete a team member
const deleteTeamMember = (_id) => {
    return schemas_1.teamMember.findOneAndDelete({ _id: _id });
};
exports.deleteTeamMember = deleteTeamMember;
