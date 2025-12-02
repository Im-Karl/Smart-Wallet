require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT;

const { startCronJobs } = require('./cron/cronController');

const budgetRoutes = require('./routes/budgetRoutes');
const authRoutes = require('./routes/authRoutes');
const statRoutes = require('./routes/statRoutes');
// const cronRoutes= require('./routes/cronRoutes')

app.use(express.json());

app.use(cors({
  origin: "*"
}));

app.use('/api/auth', authRoutes); 
app.use('/api/budgets', budgetRoutes);
app.use('/api/stats', statRoutes);
// app.use('/api/cron', cronRoutes);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connect successfully!");
        startCronJobs();
    } catch (error) {
        console.log("MongoDB connection errr", error.message);
        process.exit(1);
    }
}



connectDB().then(() => {
    app.listen(PORT, () => {

        console.log(`Server running on port ${PORT}`)
    })
})