const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectMongo } = require("./db");
const { User, Transaction, Investment, Goal } = require("./models");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const BASE_RETURN_RATE = 0.1;

const categories = [
  "Food",
  "Coffee",
  "Transport",
  "Shopping",
  "Entertainment",
  "Other",
];

function getSmartRoundStep(spendAmount) {
  if (spendAmount < 200) return 20;
  if (spendAmount > 500) return 5;
  return 10;
}

function getReturnRateForRisk(risk) {
  if (risk === "conservative") return BASE_RETURN_RATE * 0.7;
  if (risk === "aggressive") return BASE_RETURN_RATE * 1.3;
  return BASE_RETURN_RATE;
}

function getAllocationForRisk(risk) {
  if (risk === "conservative") {
    return { fdPct: 45, mutualFundsPct: 25, goldPct: 20, stocksPct: 10 };
  }
  if (risk === "aggressive") {
    return { fdPct: 10, mutualFundsPct: 35, goldPct: 15, stocksPct: 40 };
  }
  return { fdPct: 20, mutualFundsPct: 40, goldPct: 20, stocksPct: 20 };
}

async function getUserState(userId) {
  const [user, transactions, investments, goals] = await Promise.all([
    User.findById(userId).lean(),
    Transaction.find({ userId }).sort({ date: -1 }).lean(),
    Investment.find({ userId }).sort({ date: -1 }).lean(),
    Goal.find({ userId }).lean(),
  ]);

  if (!user) return null;

  const notifications = (user.notifications || []).slice(0, 5);
  const totalInvested = investments.reduce(
    (sum, inv) => sum + inv.amountInvested,
    0
  );
  const estimatedValue = investments.reduce((sum, inv) => {
    const projected = inv.amountInvested * (1 + inv.expectedReturnRate);
    return sum + projected;
  }, 0);
  const uniqueDays =
    new Set(transactions.map((t) => String(t.date).slice(0, 10))).size || 1;
  const dailySaving = (user.lifetimeSaved || 0) / uniqueDays;

  return {
    transactions: transactions.map((t) => ({ ...t, id: t._id })),
    investments: investments.map((i) => ({ ...i, id: i._id })),
    goals: goals.map((g) => ({ ...g, id: g._id })),
    notifications,
    walletBalance: user.walletBalance ?? 0,
    bankBalance: user.bankBalance ?? 50000,
    summary: {
      totalSaved: user.lifetimeSaved ?? 0,
      totalInvested,
      estimatedValue,
      sixMonthProjection: dailySaving * 30 * 6,
      oneYearProjection: dailySaving * 365,
      dailySaving,
    },
  };
}

async function addNotification(userId, message) {
  await User.updateOne(
    { _id: userId },
    {
      $push: {
        notifications: { $each: [message], $position: 0, $slice: 20 },
      },
    }
  );
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/login", (req, res) => {
  const { name, phone, aadhaar, pan, riskProfile } = req.body || {};
  if (!phone || !riskProfile) {
    return res.status(400).json({ message: "phone and riskProfile are required" });
  }

  const id = crypto.randomUUID();
  const user = {
    id,
    name: name || "Amit",
    phone,
    aadhaarMasked: `**** **** ${String(aadhaar || "").slice(-4) || "1234"}`,
    panMasked: `**** **** ${String(pan || "").slice(-4) || "1234"}`,
    riskProfile,
  };

  User.create({
    _id: id,
    ...user,
    bankBalance: 50000,
    lifetimeSaved: 0,
    walletBalance: 0,
    notifications: [`Welcome ${user.name}! Bank balance set to Rs.50000.`],
  })
    .then(async () => {
      const state = await getUserState(id);
      return res.json({ user, state });
    })
    .catch(() => res.status(500).json({ message: "Failed to create user" }));
});

app.get("/api/state/:userId", (req, res) => {
  const { userId } = req.params;
  getUserState(userId).then((state) => {
    if (!state) return res.status(404).json({ message: "User not found" });
    return res.json(state);
  });
});

app.post("/api/transactions/auto", (req, res) => {
  const { userId } = req.body || {};
  const amount = Math.floor(Math.random() * 700) + 30;
  const category = categories[Math.floor(Math.random() * categories.length)];
  User.findById(userId)
    .lean()
    .then(async (user) => {
      if (!user) return res.status(404).json({ message: "User not found" });

      if ((user.bankBalance ?? 0) < amount) {
        await addNotification(
          userId,
          `Insufficient bank balance for Rs.${amount.toFixed(2)} transaction.`
        );
        const state = await getUserState(userId);
        return res
          .status(400)
          .json({ message: "Insufficient bank balance", state });
      }

      const step = getSmartRoundStep(amount);
      const rounded = Math.ceil(amount / step) * step;
      const spare = Math.max(rounded - amount, 0);

      const txId = crypto.randomUUID();
      await Transaction.create({
        _id: txId,
        userId,
        amount,
        roundedAmount: rounded,
        spareChange: spare,
        category,
        date: new Date().toISOString(),
      });

      await User.updateOne(
        { _id: userId },
        {
          $inc: { bankBalance: -amount, lifetimeSaved: spare },
          $set: { walletBalance: 0 },
        }
      );

      await addNotification(
        userId,
        `Spent Rs.${amount} -> rounded to Rs.${rounded} (step Rs.${step}) -> spare Rs.${spare}.`
      );

      let investment = null;
      if (spare > 0) {
        const invId = crypto.randomUUID();
        investment = await Investment.create({
          _id: invId,
          userId,
          amountInvested: spare,
          date: new Date().toISOString(),
          expectedReturnRate: getReturnRateForRisk(user.riskProfile),
          currentValue: spare,
          riskLevel: user.riskProfile,
          allocation: getAllocationForRisk(user.riskProfile),
        });
        await addNotification(
          userId,
          `Auto-invested Rs.${spare.toFixed(2)} immediately.`
        );
      }

      const state = await getUserState(userId);
      return res.json({
        transaction: { id: txId },
        investment: investment ? { id: investment._id } : null,
        smartRoundStep: step,
        state,
      });
    })
    .catch(() => res.status(500).json({ message: "Transaction failed" }));
});

app.post("/api/goals", (req, res) => {
  const { userId, name, targetAmount } = req.body || {};
  if (!name || !targetAmount) return res.status(400).json({ message: "name and targetAmount required" });
  User.findById(userId)
    .lean()
    .then(async (user) => {
      if (!user) return res.status(404).json({ message: "User not found" });
      const goalId = crypto.randomUUID();
      const goal = await Goal.create({
        _id: goalId,
        userId,
        name,
        targetAmount: Number(targetAmount),
        targetDate: null,
        allocatedAmount: 0,
      });
      await addNotification(userId, `Goal "${name}" created.`);
      const state = await getUserState(userId);
      return res.json({ goal: { ...goal.toObject(), id: goal._id }, state });
    })
    .catch(() => res.status(500).json({ message: "Goal creation failed" }));
});

connectMongo()
  .then((uri) => {
    console.log(`Mongo connected: ${uri}`);
    app.listen(PORT, () => {
      console.log(`API running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Mongo connection failed", err);
    process.exit(1);
  });

