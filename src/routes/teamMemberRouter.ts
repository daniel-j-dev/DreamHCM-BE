import express, { Request, Response, Router } from "express";
import { verifyToken } from "../auth/tokenUtils";
import {
  getAllTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "../mongodb/teamMemberModel";
import { clearMemberPayments } from "../mongodb/paymentModel";
import { body, validationResult } from "express-validator";
import { clearMemberWorkDays } from "../mongodb/workDateModel";

const router: Router = express.Router();

// Get all team members
router.get("/teammember", verifyToken, async (_req: Request, res: Response) => {
  getAllTeamMembers()
    .then((members: any) => {
      res.status(200).send(members);
    })
    .catch((err: any) => {
      console.log(err);
      res.status(500).send("Database error");
    });
});

// Add a new team member
router.post(
  "/teammember",
  verifyToken,
  body("name").isString().isLength({ min: 1, max: 100 }),
  body("currentPosition").isString().isLength({ min: 1, max: 100 }),
  body("payType").isString().isLength({ min: 1, max: 100 }),
  body("pay").isFloat({ min: 0, max: 1000000000 }),
  body("hireDate").isISO8601(),
  async (req: Request, res: Response) => {
    // Validate req.body ...
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    // Create new member
    const newMember = {
      name: req.body.name,
      currentPosition: req.body.currentPosition,
      payType: req.body.payType,
      pay: req.body.pay,
      hireDate: req.body.hireDate,
    };
    createTeamMember(newMember)
      .then(() => {
        res.status(201).send("Team member created!");
      })
      .catch((error: any) => {
        console.log(error);
        res.status(500).send("Database error");
      });
  }
);

// Update a new team member
router.put(
  "/teammember",
  verifyToken,
  body("_id").exists(),
  body("name").isString().isLength({ min: 1, max: 100 }),
  body("currentPosition").isString().isLength({ min: 1, max: 100 }),
  body("payType").isString().isLength({ min: 1, max: 100 }),
  body("pay").isFloat({ min: 0, max: 1000000000 }),
  async (req: Request, res: Response) => {
    // Validate req.body ...
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    // Update member
    const updatedMember = {
      _id: req.body._id,
      name: req.body.name,
      currentPosition: req.body.currentPosition,
      payType: req.body.payType,
      pay: req.body.pay,
      hireDate: req.body.hireDate,
    };

    updateTeamMember(updatedMember)
      .then((updated: any) => {
        // Check if updated
        if (!updated) {
          res.status(404).send("Team member with matching ID was not found.");
          return;
        }

        res.status(200).send("Team member was successfully updated!");
      })
      .catch((err: any) => {
        console.log(err);
        res.status(500).send("Database error");
      });
  }
);

// Delete a new team member
router.delete(
  "/teammember",
  verifyToken,
  body("_id").exists(),
  async (req: Request, res: Response) => {
    // Validate req.body ...
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    // Delete team member
    deleteTeamMember(req.body._id)
      .then(async (deleted: any) => {
        // Check if deleted
        if (!deleted) {
          res.status(404).send("Team member with matching _id was not found.");
          return;
        }

        // Delete team member's payment entries
        await clearMemberPayments(req.body._id);

        // Delete team member's wordDat
        await clearMemberWorkDays(req.body._id);

        res.status(200).send("Team member was successfully deleted.");
      })
      .catch((error: any) => {
        console.log(error);
        res.status(500).send("Database error");
      });
  }
);

export default router;
