import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js'
import bodyParser from 'body-parser';
import paymentRoutes from './routes/paymentRoutes.js';

const PORT = process.env.PORT || 4000
const allowedOrigins = ['http://localhost:5173', 'https://imagify-client-fr1p.onrender.com'];

const app = express()

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
  


app.use(express.json())
app.use(cors())

await connectDB()

app.use('/api/user', userRouter)
app.use('/api/image', imageRouter)
app.use('/api/payment', paymentRoutes);

app.get('/',(req, res)=> res.send("API Working "))

app.listen(4000, ()=> console.log("Server running on port " + PORT))
