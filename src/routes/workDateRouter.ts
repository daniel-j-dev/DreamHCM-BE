import express, { Response, Router } from "express";
import { verifyToken } from "../auth/tokenUtils";
import {
  getMemberSchedule,
  createWorkDay,
  getDuplicateWorkDates,
} from "../mongodb/workDateModel";
import { getTeamMemberById } from "../mongodb/teamMemberModel";
import { body, validationResult } from "express-validator";

// Setup Router
const router: Router = express.Router();

// Create a work day
router.post(
  "/schedule",
  verifyToken,
  body("teamMemberId").isString(),
  body("workDate").isISO8601(),
  async (req: any, res: Response) => {
    // Validate req.body ...
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      // Check if workDate already exists for this user
      const dupes = await getDuplicateWorkDates(
        req.body.teamMemberId,
        req.body.workDate
      );

      if (dupes.length > 0) {
        res.status(400).send("Work date has already been scheduled.");
        return;
      }

      // Check if teamMemberId is valid in teamMembers
      const foundMember = await getTeamMemberById(req.body.teamMemberId);

      if (!foundMember) {
        res.status(404).send("Team member with matching ID was not found.");
        return;
      }

      // Create
      const newWorkDay = {
        teamMemberId: req.body.teamMemberId,
        workDate: req.body.workDate,
      };

      createWorkDay(newWorkDay)
        .then(() => {
          res.status(201).send("Created work day successfully!");
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

// Get schedule by teamMemberID
router.get("/schedule", verifyToken, (req: any, res: Response) => {
  if (!req?.query?.teamMemberId) {
    res
      .status(400)
      .send("Please provide a teamMemberId in the request params.");
    return;
  }

  // Find payments
  getMemberSchedule(req.query.teamMemberId)
    .then((found: any) => {
      if (!found) {
        res.status(404).send("No schedule found for this member.");
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
