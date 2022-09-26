// Imports
import express, {Application, Request, Response} from "express";
import cors from "cors";

const app: Application = express();
const port: number = 3001;

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.get("/", (req: Request, res: Response) => {
    console.log(req.body)
    res.send("Hello world")
})

// Start server
app.listen(port, () => {
    console.log("Server started")
})