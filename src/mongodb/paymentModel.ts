import { payment } from "./schemas";

// Get payments by teamMemberID
export const getMemberPayments = (id: string) => {
  return payment.find({ teamMemberId: id });
};

// Create a new payment
export const createPayment = (payDetails: any) => {
  return payment.create(payDetails);
};
