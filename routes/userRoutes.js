import express from "express";
import { applyDoctorController, authController, bookAppointmentController, bookingAvailabilityController, deleteAllNotificationController, getAllDoctorsController, getAllNotificationController, loginController, registerController, userAppoointmentsController } from "../controllers/userControllers.js";
import { requiredSignIn } from "../middlewares/authMiddleware.js";

//router object

const router=express.Router();

//routes


//REGISTER || POST
router.post('/register', registerController)

//LOGIN || POST
router.post("/login",loginController)

//auth ||post
router.post("/getUserData",requiredSignIn,authController)

//Apply doctor ||post
router.post("/apply-doctor",requiredSignIn,applyDoctorController)

//Notification ||post
router.post("/get-all-notification",requiredSignIn,getAllNotificationController)

//Notification ||post
router.post("/delete-all-notification",requiredSignIn,deleteAllNotificationController)

//Get All doctors data
router.get("/getAllDoctors",requiredSignIn,getAllDoctorsController)

// Book Appoinment
router.post("/book-appointment",requiredSignIn,bookAppointmentController)

//Booking Availability
router.post("/booking-availability",requiredSignIn,bookingAvailabilityController)

// Appointments list
router.get("/user-appointments", requiredSignIn, userAppoointmentsController)

export default router;