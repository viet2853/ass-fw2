import express, { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { authorization } from "../middlewares/authorization";
import { create, get, getAll, remove, update } from "../controllers/category";

const router: Router = express.Router();

router.get("/categories", getAll);
router.get("/categories/:id", get);
router.post("/categories", authenticate, authorization, create);
router.patch("/categories/:id", authenticate, authorization, update);
router.delete("/categories/:id", authenticate, authorization, remove);

export default router;
