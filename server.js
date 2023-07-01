import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import doctorRoutes from "./routes/doctorRoutes.js"
import cors from "cors";
import path from "path";

const __dirname = path.resolve();

//dotenv Configure
dotenv.config();

//mongodb connection
connectDB();

//rest object
const app=express();

//middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

//Routes
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/admin", adminRoutes)
app.use("/api/v1/doctor",doctorRoutes)

// static files
app.use(express.static(path.join(__dirname,"./client/build")))


app.get("*",function(req,res){
    res.sendFile(path.join(__dirname,"./client/build/index.html"))
})

//port
const port =process.env.PORT || 6060

//listen
try {
    app.listen(port,()=>{
    })
} catch (error) {
}
