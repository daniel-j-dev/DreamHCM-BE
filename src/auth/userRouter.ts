import express, {Request, Response, Router} from "express";

const router: Router = express.Router()

// Create a user account
router.post('/user', (req: Request, res: Response) => {
    console.log(req.body)
    res.send("Hello world!")
})

export default router