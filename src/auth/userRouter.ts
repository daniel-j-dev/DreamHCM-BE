import express, { Request, Response, Router } from "express";
import { getUserByEmail, createUser } from "../mongodb/userModel";
const bcrypt = require("bcryptjs");

const router: Router = express.Router();

// Get a user by email
router.get("/user", async (req: Request, res: Response) => {
  if (!req?.body?.email) {
    res.status(400).send("An email address is required.");
    return;
  }

  // "password" is excluded by default
  getUserByEmail(req.body.email)
    .then((allUsers: any) => {
      res.send(allUsers);
    })
    .catch((err: any) => {
      res.status(500).send(err);
    });
});

// Create a user account
router.post("/user", async (req: Request, res: Response) => {
  // Check if request is valid (contains email and password)
  if (!req?.body?.email || !req.body.password) {
    res.status(400).send("An email address and password are required.");
    return;
  }

  // Check if user email already exists...
  const foundUser = await getUserByEmail(req.body.email);

  if (foundUser) {
    res.status(400).send("User with matching email already exists.");
    return;
  }

  // If user doesn't already exist, create the new user object...
  const newUser = {
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 12),
  };

  // Save new user to DB
  await createUser(newUser)
    .then(() => {
      res.status(201).send("Account successfully created!");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

export default router;
