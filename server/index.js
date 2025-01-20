import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/user.js';
import blogRoutes from './routes/blog.js';
import cors from 'cors';

const app = express();

// MongoDB connection
mongoose.connect('mongodb+srv://santhosh:santhosh123@cluster0.y5n7h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('MongoDB connection successful');
    })
    .catch((err) => {
        console.log('MongoDB connection error:', err);
    });

// Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
    origin: 'http://localhost:3000' // Allow requests from your React frontend
}));

// Routes
app.use('/user', userRoutes);
app.use('/blog', blogRoutes);

// Error Handling Middleware
app.use((req, res, next) => {
    res.status(404).send('API not found');
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Something went wrong');
});

// Server
app.listen(8000, () => {
    console.log("Server running on port 8000");
});
