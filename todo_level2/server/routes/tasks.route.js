import { Router } from "express";
import {
  getTasks,
  newTask,
  updateTask,
  updateLables,
  getLabels,
  updateStatus,
  deleteTask,
} from "../controllers/task.controller.js";

const router = Router();

router.post("/task", newTask);
router.get("/tasks", getTasks);
router.put("/task/:id", updateTask);
router.put("/task/:id/labels", updateLables);
router.get("/labels", getLabels);
router.put("/task/:id/status", updateStatus);
router.delete("/task/:id", deleteTask); // Fixed delete route

export default router;
