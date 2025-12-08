import express from "express";
import{
getUsers,
getUser,
createUser,
updateUser,
deleteUser,
getUserByEmail
}from "../controllers/userController.js"
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
router.post("/",createUser);

router.get("/:correo",verifyToken,getUserByEmail)
router.get("/",verifyToken,getUsers);
router.get("/:id",verifyToken,getUser);
router.put("/:id",verifyToken,updateUser);
router.delete("/:id",verifyToken,deleteUser);
export default router;