const Budget = require("../models/Budget");
const mongoose = require("mongoose");
const DailyRecord = require("../models/DailyRecord");
const { isBefore, differenceInDays, addDays } = require("date-fns");
const { startOfDayVN } = require("../utils/time");

const toVNDate = (date) => {
  return new Date(date.getTime() + 7 * 60 * 60 * 1000);
};

const calculateTotalDays = (start, end) => {
  return differenceInDays(end, start) + 1;
};

exports.getBudgets = async (req, res) => {
  const user_id = req.user._id;
  const today = startOfDayVN();
  const skip = parseInt(req.query.skip || "0");
  const limit = parseInt(req.query.limit || "5");

  try {
    const budgetsPage = await Budget.find({ user_id })
      .sort({ start_date: -1, end_date: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const budgetsWithDaily = await Promise.all(
      budgetsPage.map(async (budget) => {
        const daily_records = await DailyRecord.find({
          budget_id: budget._id,
        }).lean();

        const net_remaining_current = daily_records
          .filter((r) => r.date <= today)
          .reduce((sum, r) => sum + r.remaining, 0);

        const days_passed = daily_records.filter((r) => r.date <= today).length;

        return {
          ...budget,
          net_remaining_current,
          days_passed,
        };
      })
    );

    const total = await Budget.countDocuments({ user_id });

    res.json({ budgets: budgetsWithDaily, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching budgets" });
  }
};

exports.getDailyRecord = async (req, res) => {
  const { budget_id, date } = req.params;

  const targetDate = startOfDayVN(new Date(date));

  const record = await DailyRecord.findOne({
    budget_id,
    date: targetDate,
  });

  if (!record)
    return res.status(404).json({ message: "Daily record không tồn tại." });

  const budget = await Budget.findById(budget_id);
  if (!budget || budget.user_id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Access denied." });
  }

  res.json(record);
};

exports.createBudget = async (req, res) => {
  const user_id = req.user._id;
  const { name, start_date, end_date, total_amount } = req.body;

  const startDate = startOfDayVN(new Date(start_date));
  const endDate = startOfDayVN(new Date(end_date));

  if (endDate < startDate)
    return res
      .status(400)
      .json({ message: "End date must be after start date" });

  const total_days = differenceInDays(endDate, startDate) + 1;
  const daily_quota = total_amount / total_days;

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

  const dailyRecords = [];
  let current = startDate;

  while (current <= endDate) {
    dailyRecords.push({
      budget_id: newBudget._id,
      date: startOfDayVN(current),
      quota: daily_quota,
      remaining: daily_quota,
    });

    current = addDays(current, 1);
  }

  await DailyRecord.insertMany(dailyRecords);

  res.status(201).json({
    budget: newBudget,
    message: "Budget created successfully.",
  });
};

exports.getDailyRecordHistory = async (req, res) => {
  const { id: budget_id } = req.params;
  const skip = parseInt(req.query.skip || "0");
  const limit = parseInt(req.query.limit || "20");

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const records = await DailyRecord.find({ budget_id, date: { $lte: today } })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    return res.json(records);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getBudgetById = async (req, res) => {
  const { id } = req.params;
  try {
    const budget = await Budget.findById(id);
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
