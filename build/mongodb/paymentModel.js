"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearMemberPayments = exports.createPayment = exports.getMemberPayments = void 0;
const schemas_1 = require("./schemas");
// Get payments by teamMemberID
const getMemberPayments = (id) => {
    return schemas_1.payment.find({ teamMemberId: id });
};
exports.getMemberPayments = getMemberPayments;
// Create a new payment
const createPayment = (payDetails) => {
    return schemas_1.payment.create(payDetails);
};
exports.createPayment = createPayment;
// Delete all payment history of a team member
const clearMemberPayments = (id) => {
    return schemas_1.payment.deleteMany({ teamMemberId: id });
};
exports.clearMemberPayments = clearMemberPayments;
