// Imports
import express, { Application } from "express";
import cors from "cors";
import userRouter from "./auth/userRouter"

const app: Application = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3001

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/", userRouter)

// Start server
app.listen(port, () => {
    console.log("Server started")
})