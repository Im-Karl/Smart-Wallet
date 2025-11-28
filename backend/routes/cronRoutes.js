// const express = require('express');
// const router = express.Router();
// const { dailyReportJob, dailyReminderJob } = require('../controllers/cronController');

// // Endpoint chạy báo cáo
// router.get('/daily-report', async (req, res) => {
//     await dailyReportJob();
//     res.json({ message: "Daily Report executed" });
// });

// // Endpoint chạy nhắc nhở
// router.get('/daily-reminder', async (req, res) => {
//     await dailyReminderJob();
//     res.json({ message: "Daily Reminder executed" });
// });

// module.exports = router;
// Sẽ triển khai trên https://console.cron-job.org/jobs/create nếu deploy
