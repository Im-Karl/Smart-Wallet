const DailyRecord = require("../models/DailyRecord");
const Budget = require("../models/Budget");
const { startOfDay, addDays } = require("date-fns");
const { default: mongoose } = require("mongoose");

exports.addTransaction = async (req, res) => {
  const { budget_id } = req.params;
  const { amount, description, category } = req.body;

  const today = new Date();
  const start = startOfDay(today);
  const end = addDays(start, 1);

  if (amount === 0) {
    return res
      .status(400)
      .json({ message: "Transaction amount cannot be zero" });
  }

  try {
    const dailyRecord = await DailyRecord.findOne({
      budget_id,
      date: { $gte: start, $lt: end },
    });

    if (!dailyRecord) {
      return res
        .status(404)
        .json({ message: "Daily record for today not found for this budget." });
    }

    dailyRecord.transactions.push({ amount, description, category });

    if (amount < 0) {
      dailyRecord.spent += Math.abs(amount); // amount âm -> tăng spent
    } else {
      dailyRecord.added_money += amount; // amount dương -> tăng added_money
    }

    dailyRecord.remaining =
      dailyRecord.quota + dailyRecord.added_money - dailyRecord.spent;

    await dailyRecord.save();

    await updateBudgetSummary(budget_id);

    res.status(201).jsoN({
      message: "Transaction added and Daily Record updated.",
      dailyRecord,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error adding transaction", error: error.message });
  }
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
            $sum: { $cond: [{ $gt: ["$remainging", 0] }, "$remaining", 0] },
          },
          total_saved: {
            $sum: { $cond: [{ $gt: ["$remaining", 0] }, "$remaining", 0] },
          },
          total_over_limit: {
            $sum: {
              $cond: [{ $gt: ["$remaining", 0] }, { $abs: "$remaining" }, 0],
            },
          },
        },
      },
    ]);

    const summary = aggragationResult[0] || {};

    await Budget.findByIdAndUpdate(budget_id, {
      total_spent: summary.total_spent || 0,
      total_saved: summary.total_saved || 0,
      // total_over_limit ở đây là tổng các phần âm (Bước 3)
      total_over_limit: summary.total_over_limit || 0,
      net_remaining: summary.net_remaining || 0,
    });
  } catch (error) {
    console.error("Error updating budget summary:", error);
  }
};
