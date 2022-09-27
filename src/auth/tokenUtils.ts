const jwt = require("jsonwebtoken");
import { Response } from "express";

type userPayload = {
  _id: string;
  email: string;
};

// JWT Secret
if (!process.env.JWT_SECRET) throw '"JWT_SECRET" not found in process.env';
const secret: String = process.env.JWT_SECRET;

// Generates a new JWT
export const generateToken = (user: any) => {
  if (!(user as userPayload))
    throw 'Please provide generateToken an "email" and an "_id"';

  const payload = {
    _id: user._id,
    email: user.email,
  };

  const options = {
    expiresIn: "1d",
  };

  return jwt.sign(payload, secret, options);
};

// Middleware to verify & decode a JWT
export const verifyToken = (req: any, res: Response, next: Function) => {
  // Check for token
  const token = req?.headers?.authorization;

  if (!token) {
    res.status(400).send("User must be signed in. Please provide a token.");
    return;
  }

  // Verify & decode token
  jwt.verify(token, secret, (error: any, decodedToken: String) => {
    if (error) {
      res.status(401).json({ you: "Invalid or expired token" });
      return;
    }

    // Add decoded token to request
    req.decodedToken = decodedToken;

    next();
  });
};
