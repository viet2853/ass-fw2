import express, { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import {
  getUserProfile,
  updateUserProfile,
  getAll,
  remove,
  update,
} from "../controllers/user";
import { authorization } from "../middlewares/authorization";

const router: Router = express.Router();

router.get("/users", authenticate, authorization, getAll);
router.delete("/users/:id", authenticate, authorization, remove);
router.patch("/users/:id", authenticate, authorization, update);

router.post("/user/profile", authenticate, getUserProfile);
router.put("/user/update", authenticate, updateUserProfile);
export default router;
