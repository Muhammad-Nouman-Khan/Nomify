import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  getMyFriends,
  getRecommendedUsers,
} from "../controllers/user.controller.js";

const router = express.Router();

router.use(protectRoute); // all routes below this line are protected (can also do other way)

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

export default router;
