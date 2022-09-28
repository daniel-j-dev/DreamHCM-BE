import express, { Response, Router } from "express";
import { verifyToken } from "../auth/tokenUtils";
import { getMemberPayments, createPayment } from "../mongodb/paymentModel";
import { getTeamMemberById } from "../mongodb/teamMemberModel";
import { body, validationResult } from "express-validator";

// Setup Router
const router: Router = express.Router();

// Create a payment
router.post(
  "/payment",
  verifyToken,
  body("teamMemberId").isString(),
  body("payAmount").isFloat({ min: 0, max: 1000000000 }),
  body("originalAmount").isFloat({ min: 0, max: 1000000000 }),
  body("modifications").isArray(),
  async (req: any, res: Response) => {
    // Validate req.body ...
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      // Check if teamMemberId is valid in teamMembers
      const foundMember = await getTeamMemberById(req.body.teamMemberId);

      if (!foundMember) {
        res.status(404).send("Team member with matching ID was not found.");
        return;
      }

      // Create
      const newPayment = {
        teamMemberId: req.body.teamMemberId,
        payAmount: req.body.payAmount,
        originalAmount: req.body.originalAmount,
        modifications: req.body.modifications,
      };

      createPayment(newPayment)
        .then(() => {
          res.status(201).send("Created payment successfully!");
        })
        .catch((error: any) => {
          console.log(error);
          res.status(500).send("Database error.");
        });
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error.");
    }
  }
);

// Get payments by teamMemberID
router.get("/payment", verifyToken, (req: any, res: Response) => {
  if (!req?.query?.teamMemberId) {
    res
      .status(400)
      .send("Please provide a teamMemberId in the request params.");
    return;
  }

  // Find payments
  getMemberPayments(req.query.teamMemberId)
    .then((found: any) => {
      if (!found) {
        res.status(404).send("No payments found for this member.");
        return;
      }

      res.status(200).send(found);
    })
    .catch((err: any) => {
      console.log(err);
      res.status(500).send("Database error.");
    });
});

export default router;
