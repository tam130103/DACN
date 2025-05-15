import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';

//app configuration
const app = express();
const PORT = 4000;

//middleware
app.use(express.json());
app.use(cors());

// db connection
connectDB();

// api endpoints
app.use('/api/food', foodRouter); // Fixed typo: changed 'foodRouterter' to 'foodRouter'
app.use("/images",express.static("uploads")); // Serve static files from the 'uploads' directory


app.get("/", (req, res) => {
    res.send("API Working");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

