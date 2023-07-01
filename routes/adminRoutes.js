import express from "express"
import { requiredSignIn } from "../middlewares/authMiddleware.js";
import { changeAccountStatusController, getAllDoctorsController, getAllUsersController } from "../controllers/adminControllers.js";

const router=express.Router();

//GET METHOD || USERS
router.get("/getAllUsers", requiredSignIn, getAllUsersController)

//GET METHOD || USERS
router.get("/getAllDoctors", requiredSignIn, getAllDoctorsController)

//POST ACCOUNT STATUS
router.post('/changeAccountStatus', requiredSignIn, changeAccountStatusController)

export default router;