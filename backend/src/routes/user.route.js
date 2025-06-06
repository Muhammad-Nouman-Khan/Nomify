import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  getMyFriends,
  getRecommendedUsers,
  sendFriendRequest,
} from "../controllers/user.controller.js";

const router = express.Router();

router.use(protectRoute); // all routes below this line are protected (can also do other way)

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);

export default router;
