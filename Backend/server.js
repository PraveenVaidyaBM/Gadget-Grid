// external libraries
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// config the environment variables
dotenv.config();
import connectDB from './config/db.js';
import userRoutes from './routes/userRoute.js';
import productRoutes from './routes/productRoutes.js';
import { notFound,errorHandler } from './middleware/errorMiddleware.js';
import orderRoutes from './routes/orderRoutes.js';

// define the port
const PORT = process.env.PORT || 5000;

// connect to database
connectDB();

// initialize the app
const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(cors({
        origin: 'http://localhost:5173',
        credentials: true,
    }));
}

// body parser middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// cookie parser middleware

app.use(cookieParser())

// define routes

// route for homepage
app.get('/', (req, res) => {
    res.send('API is running...');
});

// user route
app.use('/api/users', userRoutes);

// use product routes
app.use('/api/products', productRoutes);   

// use order routes
app.use('/api/orders', orderRoutes);

// middleware for handling errors
app.use(notFound);
app.use(errorHandler);

// start the server on defined port
app.listen(PORT, console.log(`Server running on port ${PORT}`));
