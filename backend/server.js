require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT;


const budgetRoutes = require('./routes/budgetRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(express.json());

app.use('/api/auth', authRoutes); 
app.use('/api/budgets', budgetRoutes);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connect successfully!");
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