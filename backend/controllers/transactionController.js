const DailyRecord = require("../models/DailyRecord");
const Budget = require("../models/Budget");
const {  addDays } = require("date-fns");
const { startOfDayVN, toVNDate } = require("../utils/time");
const { default: mongoose } = require("mongoose");



exports.addTransaction = async (req, res) => {
  const { budget_id } = req.params;
  const { amount, description, category } = req.body;

  const start = startOfDayVN();
  const end = addDays(start, 1);

  const dailyRecord = await DailyRecord.findOne({
    budget_id,
    date: { $gte: start, $lt: end },
  });

  if (!dailyRecord) {
    return res.status(404).json({
      message: "Quỹ đã kết thúc hoặc không tồn tại ngày hôm nay.",
    });
  }

  dailyRecord.transactions.push({
    amount,
    description,
    category,
    created_at: toVNDate(),
  });

  if (amount < 0) dailyRecord.spent += Math.abs(amount);
  else dailyRecord.added_money += amount;

  dailyRecord.remaining =
    dailyRecord.quota + dailyRecord.added_money - dailyRecord.spent;

  await dailyRecord.save();
  await updateBudgetSummary(budget_id);

  res.status(201).json({ message: "Transaction added", dailyRecord });
};

const updateBudgetSummary = async (budget_id) => {
  try {
    const aggragationResult = await DailyRecord.aggregate([
      { $match: { budget_id: new mongoose.Types.ObjectId(budget_id) } },
      {
        $group: {
          _id: null,
          total_spent: { $sum: "$spent" },
          net_remaining: { $sum: "$remaining" },
          total_saved: {
            $sum: { $cond: [{ $gt: ["$remaining", 0] }, "$remaining", 0] },
          },
          total_over_limit: {
            $sum: {
              $cond: [{ $lt: ["$remaining", 0] }, { $abs: "$remaining" }, 0],
            },
          },
        },
      },
    ]);

    const summary = aggragationResult[0] || {};

    await Budget.findByIdAndUpdate(budget_id, {
      total_spent: summary.total_spent || 0,
      total_saved: summary.total_saved || 0,
      total_over_limit: summary.total_over_limit || 0,
      net_remaining: summary.net_remaining || 0,
    });
  } catch (error) {
    console.error("Error updating budget summary:", error);
  }
};
