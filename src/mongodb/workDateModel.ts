import { workDate } from "./schemas";

// Get payments by teamMemberID
export const getMemberSchedule = (id: string) => {
  return workDate.find({ teamMemberId: id });
};

// Create a new payment
export const createWorkDay = (newDate: any) => {
  return workDate.create(newDate);
};

// Check for existing workDate for a team member
export const getDuplicateWorkDates = (teamMemberId: number, wDate: any) => {
  return workDate.find({ teamMemberId: teamMemberId, workDate: wDate });
};
