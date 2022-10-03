import { workDay } from "./schemas";

// Get payments by teamMemberID
export const getMemberSchedule = (id: string) => {
  return workDay.find({ teamMemberId: id });
};

// Create a new payment
export const createWorkDay = (newDate: any) => {
  return workDay.create(newDate);
};

// Check for existing workDate for a team member
export const getDuplicateWorkDates = (teamMemberId: number, wDate: any) => {
  return workDay.find({ teamMemberId: teamMemberId, workDate: wDate });
};

// Delete a work day
export const deleteWorkDay = (teamMemberId: number, wDate: any) => {
  return workDay.findOneAndDelete({
    teamMemberId: teamMemberId,
    workDate: wDate,
  });
};

// Delete all work days of a team member
export const clearMemberWorkDays = (id: string) => {
  return workDay.deleteMany({ teamMemberId: id });
};
