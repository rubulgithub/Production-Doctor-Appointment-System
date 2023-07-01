import express from 'express'
import { requiredSignIn } from "../middlewares/authMiddleware.js";
import { doctorAppointmentsController, getDoctorByIdController, getDoctorInfoController, updateProfileController, updateStatusController } from '../controllers/doctorController.js';

const router=express.Router()

//Get single doctor info

router.post("/getDoctorInfo",requiredSignIn, getDoctorInfoController)

//post update profile
router.post("/updateProfile", requiredSignIn, updateProfileController)

//Get Single doctor by id
router.post("/getDoctorById",requiredSignIn,getDoctorByIdController)

//GEt Appointments
router.get("/doctor-appointments",requiredSignIn, doctorAppointmentsController)

// POST Update Status
router.post("/update-status", requiredSignIn,updateStatusController)
export default router