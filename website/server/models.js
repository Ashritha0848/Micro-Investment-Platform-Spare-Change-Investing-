const mongoose = require("mongoose");

const AllocationSchema = new mongoose.Schema(
  {
    fdPct: { type: Number, required: true },
    mutualFundsPct: { type: Number, required: true },
    goldPct: { type: Number, required: true },
    stocksPct: { type: Number, required: true },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // uuid
    name: { type: String, required: true },
    phone: { type: String, required: true },
    aadhaarMasked: { type: String, required: true },
    panMasked: { type: String, required: true },
    riskProfile: {
      type: String,
      enum: ["conservative", "moderate", "aggressive"],
      required: true,
    },
    bankBalance: { type: Number, required: true, default: 50000 },
    lifetimeSaved: { type: Number, required: true, default: 0 },
    walletBalance: { type: Number, required: true, default: 0 },
    notifications: { type: [String], required: true, default: [] },
  },
  { timestamps: true }
);

const TransactionSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // uuid
    userId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    roundedAmount: { type: Number, required: true },
    spareChange: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

const InvestmentSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // uuid
    userId: { type: String, required: true, index: true },
    amountInvested: { type: Number, required: true },
    date: { type: String, required: true },
    expectedReturnRate: { type: Number, required: true },
    currentValue: { type: Number, required: true },
    riskLevel: {
      type: String,
      enum: ["conservative", "moderate", "aggressive"],
      required: true,
    },
    allocation: { type: AllocationSchema, required: true },
    goalId: { type: String, default: null },
  },
  { timestamps: true }
);

const GoalSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // uuid
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    targetDate: { type: String, default: null },
    allocatedAmount: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
const Transaction = mongoose.model("Transaction", TransactionSchema);
const Investment = mongoose.model("Investment", InvestmentSchema);
const Goal = mongoose.model("Goal", GoalSchema);

module.exports = { User, Transaction, Investment, Goal };

