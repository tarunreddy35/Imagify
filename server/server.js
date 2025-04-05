import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js'
import bodyParser from 'body-parser';
import paymentRoutes from './routes/paymentRoutes.js';

const PORT = process.env.PORT || 4000

const app = express()

app.use(
    '/api/payment/webhook',
    bodyParser.raw({ type: 'application/json' })
  );
  


app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173', // allow frontend dev server
  credentials: true,
}))

await connectDB()

app.use('/api/user', userRouter)
app.use('/api/image', imageRouter)
app.use('/api/payment', paymentRoutes);

app.get('/',(req, res)=> res.send("API Working "))

app.listen(4000, ()=> console.log("Server running on port " + PORT))