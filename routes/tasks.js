import express from "express";
import {
  getTasksUser,
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  syncTasks
} from "../controllers/taskController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/user/:id",verifyToken,getTasksUser);
router.get("/", verifyToken, getTasks);
router.get("/:id", verifyToken, getTask);

router.post("/", verifyToken, createTask);

router.put("/:id", verifyToken, updateTask);
router.delete("/:id", verifyToken, deleteTask);


router.post("/sync",verifyToken,syncTasks);

export default router;