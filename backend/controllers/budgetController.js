const Budget = require("../models/Budget");
const mongoose = require("mongoose");
const DailyRecord = require("../models/DailyRecord");
const { isBefore, differenceInDays, addDays, startOfDay } = require("date-fns");

const toVNDate = (date) => {
  return new Date(date.getTime() + 7 * 60 * 60 * 1000);
};

const startOfDayVN = (date) => {
  const vn = toVNDate(date);
  return new Date(
    Date.UTC(vn.getUTCFullYear(), vn.getUTCMonth(), vn.getUTCDate())
  );
};

const calculateTotalDays = (start, end) => {
  return differenceInDays(end, start) + 1;
};

exports.getBudgets = async (req, res) => {
  const user_id = req.user._id;
  const today = startOfDayVN(new Date());

  try {
    const budgets = await Budget.aggregate([
      { $match: { user_id: new mongoose.Types.ObjectId(user_id) } },

      {
        $lookup: {
          from: "dailyrecords",
          localField: "_id",
          foreignField: "budget_id",
          as: "daily_records",
        },
      },

      {
        $addFields: {
          net_remaining_current: {
            $sum: {
              $map: {
                input: "$daily_records",
                as: "record",
                in: {
                  $cond: [
                    // Chỉ tính tổng các DailyRecord CÓ NGÀY <= HÔM NAY
                    { $lte: ["$$record.date", today] },
                    "$$record.remaining",
                    0,
                  ],
                },
              },
            },
          },
          // (Tùy chọn) Tính tổng số ngày đã qua:
          days_passed: {
            $size: {
              $filter: {
                input: "$daily_records",
                as: "record",
                cond: { $lte: ["$$record.date", today] },
              },
            },
          },
        },
      },

      {
        $project: {
          daily_records: 0,
        },
      },
    ]);

    res.json(budgets);
  } catch (error) {
    console.log("Error fetching budgets with summary:", error);
    res
      .status(500)
      .json({ message: "Error fetching budget data", error: error.message });
  }
};

exports.getDailyRecord = async (req, res) => {
  const { budget_id, date } = req.params;

  const targetDate = startOfDayVN(new Date(date));

  try {
    const record = await DailyRecord.findOne({
      budget_id,
      date: targetDate,
    });

    if (!record) {
      return res
        .status(404)
        .json({ message: "Daily record not found for this date." });
    }

    const budget = await Budget.findById(budget_id);
    if (!budget || budget.user_id.toString() !== req.user._id.toString()) {
      return res.status(4003).json({ message: "Access denied." });
    }

    res.json(record);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching daily record", error: error.message });
  }
};

exports.createBudget = async (req, res) => {
  const user_id = req.user._id;
  const { name, start_date, end_date, total_amount } = req.body;

  const startDate = startOfDayVN(new Date(start_date));
  const endDate = startOfDayVN(new Date(end_date));

  if (isBefore(endDate, startDate)) {
    return res
      .status(400)
      .json({ message: "End date must be after start date" });
  }

  const total_days = calculateTotalDays(startDate, endDate);
  const daily_quota = total_amount / total_days;

  try {
    const newBudget = new Budget({
      name,
      user_id,
      start_date: startDate,
      end_date: endDate,
      total_amount,
      daily_quota,
      net_remaining: total_amount,
    });

    await newBudget.save();

    let currentDate = startDate;
    const dailyRecords = [];

    while (!isBefore(endDate, currentDate)) {
      dailyRecords.push({
        budget_id: newBudget._id,
        date: startOfDayVN(currentDate),
        quota: daily_quota,
        remaining: daily_quota,
      });
      currentDate = addDays(currentDate, 1);
    }

    await DailyRecord.insertMany(dailyRecords);

    res.status(201).json({
      budget: newBudget,
      message: `Created budget and ${dailyRecords.length} daily records.`,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error creating budget", error: error.message });
  }
};
