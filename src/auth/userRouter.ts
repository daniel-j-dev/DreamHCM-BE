import express, { Request, Response, Router } from "express";
import { createUser } from "../mongodb/userModel";

const router: Router = express.Router();

// Create a user account
router.post("/user", (req: Request, res: Response) => {
  // Check if request is valid (contains username and password)

  // Check if user email already exists...

  // If user doesn't already exist, hash the password...

  // Save new user to DB

  console.log(req.body);
  createUser();
  res.send("Hello world!");
});

export default router;
