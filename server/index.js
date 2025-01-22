import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/user.js';
import blogRoutes from './routes/blog.js';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();

// MongoDB connection using the environment variable
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('MongoDB connection successful');
    })
    .catch((err) => {
        console.log('MongoDB connection error:', err);
    });

// Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.get('/api/healthcheck', (req, res) => {
    res.status(200).json({ message: 'API is working' });
});


// CORS setup (Allow requests from localhost:3000)
app.use(cors({
    origin: 'https://client-pied-pi.vercel.app',
    methods: ['GET', 'POST','DELETE'], // Specify allowed methods as needed
    credentials: true // Hard-coded to allow requests from your React frontend or change it accordingly
}));

// Routes
app.use('/user', userRoutes);
app.use('/blog', blogRoutes);

// Error Handling Middleware for undefined routes
app.use((req, res, next) => {
    res.status(404).send('API not found');
});

// General error handling
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Something went wrong');
});

// Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
