import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  getMyFriends,
  getRecommendedUsers,
  sendFriendRequest,
  acceptFriendRequest,
} from "../controllers/user.controller.js";

const router = express.Router();

router.use(protectRoute); // all routes below this line are protected (can also do other way)

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest); // why put ? : because we are updating something on the server side.

export default router;
