import express, { Request, Response, Router } from "express";
import {
  getUserByEmail,
  createUser,
  UNSAFE_getUserByEmail,
} from "../mongodb/userModel";
const bcrypt = require("bcryptjs");
import { generateToken, verifyToken } from "../auth/tokenUtils";

const router: Router = express.Router();

// Get a user by email
router.get("/user", verifyToken, async (req: Request, res: Response) => {
  if (!req?.body?.email) {
    res.status(400).send("An email address is required.");
    return;
  }

  // "password" is excluded by default
  getUserByEmail(req.body.email)
    .then((usr: any) => {
      res.send(usr);
    })
    .catch((err: any) => {
      console.log(err);
      res.status(500).send("Database error");
    });
});

// Create a user account
router.post("/user/signup", async (req: Request, res: Response) => {
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
      console.log(err);
      res.status(500).send("Database error");
    });
});

// Sign in

router.post("/user/signin", async (req: Request, res: Response) => {
  // Check for email and password
  if (!req?.body?.email || !req.body.password) {
    res.status(400).send("An email address and password are required.");
    return;
  }

  // Check if user email exists in DB
  const foundUser = await UNSAFE_getUserByEmail(req.body.email);

  if (!foundUser) {
    res.status(401).send("No user with that email was found.");
    return;
  }

  // Check if the request password matches with the DB password hash
  if (!bcrypt.compareSync(req.body.password, foundUser.password)) {
    res.status(401).send("Password is incorrect.");
    return;
  }

  // Generate and send a JWT
  const newToken = generateToken({
    _id: foundUser._id,
    email: foundUser.email,
  });

  res.status(200).send(newToken);
});

export default router;
