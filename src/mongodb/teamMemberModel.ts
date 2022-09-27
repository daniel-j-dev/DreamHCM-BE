import { teamMember } from "./schemas";

// Get all team members
export const getAllTeamMembers = () => {
  return teamMember.find({});
};

// Get team member by "_id"
export const getTeamMemberById = (id: string) => {
  return teamMember.findOne({ _id: id });
};

// Create a new team member
export const createTeamMember = (member: any) => {
  return teamMember.create(member);
};

// Update a team member
export const updateTeamMember = (modifiedMember: any) => {
  return teamMember.findOneAndUpdate(
    { _id: modifiedMember._id },
    modifiedMember
  );
};

// Delete a team member
export const deleteTeamMember = (_id: string) => {
  return teamMember.findOneAndDelete({ _id: _id });
};
