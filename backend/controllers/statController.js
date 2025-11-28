const DailyRecord = require('../models/DailyRecord');
const Budget = require('../models/Budget');
const mongoose = require('mongoose');

const getUserBudgetIds = async (userId) => {
    const budgets = await Budget.find({user_id: userId}).select('_id');
    return budgets.map(b => b._id);
};



exports.getCategoryStats = async (req,res) => {
    const user_id = req.user._id;

    try {
        const budgetIds = await getUserBudgetIds(user_id);

        if(budgetIds.length === 0){
            return res.json([]);
        }


        const stats = await DailyRecord.aggregate([
            { $match: { budget_id: { $in: budgetIds } } },

            { $unwind: "$transactions" },

            { $match: { "transactions.amount": { $lt: 0 } } },

            {
                $group: {
                    _id: "$transactions.category",
                    totalSpent: { $sum: { $abs: "$transactions.amount" } },
                },
            },

            { $sort: { totalSpent: -1 } }
        ]);
        res.json(stats);
    } catch (error) {
        console.error("Lỗi thống kê danh mục:", error);
        res.status(500).json({ message: "Lỗi Server khi lấy thống kê danh mục" });
    }
};


exports.getMonthlyFlow = async (req,res) => {
    const user_id = req.user._id;

    try {
        const budgetIds = await getUserBudgetIds(user_id);

        if(budgetIds.length === 0){
            return res.json([]);
        }

        const flowData = await DailyRecord.aggregate([
            { $match: { budget_id: { $in: budgetIds } } },

            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                    },
                    totalSpent: { $sum: "$spent" }, // $spent là tổng chi tiêu (giá trị dương)
                    totalAdded: { $sum: "$added_money" }, // $added_money là tổng tiền thêm (giá trị dương)
                },
            },

            { $sort: { "_id.year": 1, "_id.month": 1 } },

            {
                $project: {
                    _id: 0, // Ẩn _id
                    dateLabel: { 
                        $concat: [
                            { $toString: "$_id.month" }, "/", { $toString: "$_id.year" }
                        ]
                    },
                    month: "$_id.month",
                    year: "$_id.year",
                    spent: "$totalSpent",
                    added: "$totalAdded",
                    netFlow: { $subtract: ["$totalAdded", "$totalSpent"] } // Thu nhập - Chi tiêu
                }
            }
        ]);

        res.json(flowData)
    } catch (error) {
        console.error("Lỗi thống kê dòng tiền:", error);
        res.status(500).json({ message: "Lỗi Server khi lấy thống kê dòng tiền" });
    }
};