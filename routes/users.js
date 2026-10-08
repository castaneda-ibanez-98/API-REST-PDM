import express from "express";
import{
getUsers,
getUser,
createUser,
updateUser,
deleteUser,
getUserByEmail,
updatePassword, 
forgotPassword
}from "../controllers/userController.js"
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
router.post("/",createUser);

router.get("/email/:correo",verifyToken,getUserByEmail)
router.get("/",verifyToken,getUsers);
router.get("/id/:id",verifyToken,getUser);

//nuevo
router.put("/:id/updatePassword", verifyToken, updatePassword);
//router.put("/:id/forgotPassword", verifyToken, forgotPassword);

router.put("/:id",verifyToken,updateUser);
router.delete("/:id",verifyToken,deleteUser);
export default router;