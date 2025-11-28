const cron = require('node-cron');
const DailyRecord = require("../models/DailyRecord");
const Budget = require("../models/Budget");
const User = require("../models/User");
const { sentEmail, sendEmail } = require("../services/emailService");
const {startOfDay, subDays} = require('date-fns');
const mongoose = require('mongoose');


// A. Cron Job 1: Báo cáo hàng ngày (00:00)
const dailyReportJob = async () => {
    console.log('--- CRON JOB: Bắt đầu gửi báo cáo 00:00 ---');

    //  lấy ngày hôm qua
    const yesterday = startOfDay(subDays(new Date(), 1));

    try {
        const records = await DailyRecord.find({
            date: yesterday
        });

        for( const record of records ){
            const budget = await Budget.findById(record.budget_id);
            const user = await User.findById(budget?.user_id);

            if(!budget || !user) continue;

            if (new Date(budget.end_date) < new Date()) continue;

            const htmlContent = generateReportHtml(record, budget, user);
            const subject = `Báo cáo chi tiêu ngày ${yesterday.toLocaleDateString('vi-VN')} - ${budget.name}`;

            await sendEmail(user.email, subject, htmlContent);
        }

        console.log('--- CRON JOB: Hoàn thành gửi báo cáo 00:00 ---');
    } catch (error) {
        console.error('Lỗi trong DailyReportJob:', error);
    }
};


// B. Cron Job 2: Nhắc nhở (20:00) - Bước 7
const dailyReminderJob = async () => {
    console.log('--- CRON JOB: Bắt đầu gửi nhắc nhở 20:00 ---');

    const today = startOfDay(new Date());

    try{
        const records = await DailyRecord.find({
            date: today,
            spent: 0,
            added_money: 0
        });

        for (const record of records){
            const budget = await Budget.findById(record.budget_id);
            const user = await User.findById(budget?.user_id);


            if(!budget || !user) continue;

            if (new Date(budget.end_date) < new Date()) continue;

            const subject = `⚠️ Nhắc Nhở: Bạn chưa ghi nhận chi tiêu hôm nay!`;
            const htmlContent = `
                <p>Xin chào, ${user.email},</p>
                <p>Chúng tôi nhận thấy bạn chưa ghi nhận bất kỳ giao dịch nào cho Budget <strong>${budget.name}</strong> hôm nay.</p>
                <p>Hãy cập nhật chi tiêu của bạn để theo dõi kế hoạch ngân sách tốt hơn nhé!</p>
            `;

            await sendEmail(user.email, subject, htmlContent);
        }
        console.log('--- CRON JOB: Hoàn thành gửi nhắc nhở 20:00 ---');
    }catch (error) {
        console.error('Lỗi trong DailyReminderJob:', error);
    }
};

const generateReportHtml = (dailyRecord, budget, user) => {
    let statusText = '';
    let statusColor = '';
    if(dailyRecord.remaining > 0){
        statusText = 'Underused (Tiết kiệm)';
        statusColor = '#4CAF50';
    }else if(dailyRecord.remaining < 0){
        statusText = 'Overspent (Chi vượt mức)';
        statusColor = '#F44336';
    }else{
        statusText = 'OK (Vừa đủ)';
        statusColor = '#2196F3';
    }

    const formatCurrency= (amount) => new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);


    const transactionList = dailyRecord.transactions.map(t => `
        <li>${t.description}: ${formatCurrency(t.amount)}</li>
    `).join('');

    return `
    <h2>Báo Cáo Chi Tiêu Ngày ${dailyRecord.date.toLocaleDateString('vi-VN')}</h2>
        <h3>Budget: ${budget.name}</h3>
        
        <h4>Danh sách các giao dịch:</h4>
        <ul>${transactionsList || '<li>Không có giao dịch nào được ghi nhận.</li>'}</ul>

        <p><strong>Quota:</strong> ${formatCurrency(dailyRecord.quota)}</p>
        <p><strong>Tổng chi tiêu (spent):</strong> ${formatCurrency(dailyRecord.spent)}</p>
        <p><strong>Tổng tiền thêm (added_money):</strong> ${formatCurrency(dailyRecord.added_money)}</p>
        <p><strong>Remaining (Dư/Vượt):</strong> <strong style="color: ${statusColor};">${formatCurrency(dailyRecord.remaining)}</strong></p>
        <p><strong>Trạng Thái:</strong> <strong style="color: ${statusColor};">${statusText}</strong></p>
    `;
};


exports.startCronJobs = () => {
    // 1. Job 00:00: Gửi email báo cáo ngày hôm qua
    cron.schedule('0 0 0 * * *', dailyReportJob, {
        timezone: "Asia/Ho_Chi_Minh" 
    }); 

    // 2. Job 20:00: Gửi email nhắc nhở nếu chưa ghi chi tiêu
    cron.schedule('0 0 21 * * *', dailyReminderJob, {
        timezone: "Asia/Ho_Chi_Minh" 
    });

    console.log('⏱️ Cron Jobs đã được khởi tạo: Báo cáo (00:00) và Nhắc nhở (20:00).');
}