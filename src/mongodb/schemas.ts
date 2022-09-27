// TypeScript types not working without using "require()"
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// HR User Account

const userSchema = new Schema({
  email: { type: String, maxLength: 100, unique: true, required: true },
  password: { type: String, maxLength: 1000, select: false, required: true },
  dateAdded: { type: Date, default: Date.now, required: true },
});

// Team member added to the platform
const teamMemberSchema = new Schema({
  name: { type: String, maxLength: 100, required: true },
  currentPosition: { type: String, maxLength: 100, required: true },
  payType: { type: String, default: "Salary", maxLength: 100, required: true },
  pay: { type: Number, min: 0, max: 1000000000, required: true },
  hireDate: { type: Date, required: true },
  dateAdded: { type: Date, default: Date.now, required: true },
});

// Pay history for Team Members
const paymentSchema = new Schema({
  teamMemberID: {
    type: ObjectId,
    ref: "teamMember",
    required: true,
  },
  payAmount: { type: Number, min: 0, max: 1000000000, required: true },
  originalAmount: { type: Number, min: 0, max: 1000000000, required: true }, // Amount before modifications
  modifications: [
    {
      reason: { type: String, maxLength: 100, required: true },
      modificationType: {
        type: String,
        default: "number",
        maxLength: 100,
        required: true,
      }, // "number" or "percent"
      value: {
        type: Number,
        min: -1000000000,
        max: 1000000000,
        required: true,
      },
    },
  ],
  dateAdded: { type: Date, default: Date.now, required: true },
});

const user = mongoose.model("user", userSchema);

const teamMember = mongoose.model("teamMember", teamMemberSchema);

const payHistory = mongoose.model("payment", paymentSchema);

export { user, teamMember, payHistory };
