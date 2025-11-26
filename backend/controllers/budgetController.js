const Budget = require('../models/Budget');
const DailyRecord = require('../models/DailyRecord');
const { isBefore, differenceInDays, addDays, startOfDay } = require('date-fns');

const calculateTotalDays = (start, end) => {
    return differenceInDays(end, start) + 1;
};


exports.createBudget = async (req,res) => {
    const user_id = req.user_id;
    const {name, start_date, end_date, total_amount} = req.body;

    const startDate = startOfDay(new Date(start_date));
    const endDate = startOfDay(new Date(end_date));

    if(isBefore(endDate, startDate)){
        return res.status(400).json({message: "End date must be after start date"});
    }

    const total_days = calculateTotalDays(startDate,endDate);
    const daily_quota = total_amount/ total_days;


    try {
        const newBudget = new Budget({
            name, 
            user_id,
            start_date: startDate,
            end_date: endDate,
            total_amount,
            daily_quota,
            net_remaining: total_amount
        });

        await newBudget.save();

        let currentDate = startDate;
        const dailyRecords = [];

        while (!isBefore(endDate,currentDate)) {
            dailyRecords.push({
                budget_id: newBudget._id,
                date: currentDate,
                quota: daily_quota,
                remaining: daily_quota
            });
            currentDate = addDays(currentDate,1);
        }

        await DailyRecord.insertMany(dailyRecords);

        res.status(201).json({
            budget: newBudget,
            message: `Created budget and ${dailyRecords.length} daily records.`
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error creating budget", error: error.message})
    }
}