import userModels from "../models/userModels.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import doctorModel from "../models/doctorModel.js"
import appointmentModel from "../models/appointmentModel.js";
import moment from "moment"

// rgoster callback
export const registerController=async(req,res)=>{
    try {
        const existingUser=await userModels.findOne({email:req.body.email})
        if(existingUser){
            return res.status(200).send({message:'user Already Exist',success:false})
        }
        const password = req.body.password;
        const salt= await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password,salt);
        req.body.password=hashedPassword;
        const newUser=new userModels(req.body);
        await newUser.save();
        res.status(201).send(({message:"Registration Successfully",success:true}))
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:`Register Controller ${error.message}`
        })
    }
};

//login callback
export const loginController=async(req,res)=>{
    try {
        const user=await userModels.findOne({email:req.body.email})
        if(!user){
            return res.status(200).send({message:"User not found",success:false})
        }
        const isMatch=await bcrypt.compare(req.body.password,user.password);
        if(!isMatch){
            return res.status(200).send({message:"Invalid Email or Password",success:false})
        }
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})
        res.status(200).send({message:"Login Successfull",success:true,token})
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:`Login Controller ${error.message}`
        })
    }
};

export const authController=async(req,res)=>{
    try {
        const user=await userModels.findById({_id:req.body.userId});
        user.password=undefined;
        if(!user){
            return res.status(200).send({
                message:"user not Found",
                success:false
            })
        }else{
            res.status(200).send({
                success:true,
                data:user
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message:"auth error",
            success:false,
            error
        })
    }
}

//Apply doctor controoler

export const applyDoctorController=async(req,res)=>{
    try {
        const newDoctor=await doctorModel({...req.body,status:"pending"});
        await newDoctor.save();
        const adminUser= await userModels.findOne({isAdmin:true})
        const notification=adminUser.notification
        notification.push({
            type:'apply-doctor-request',
            message:`${newDoctor.firstName} ${newDoctor.lastName} Has Applied for A Doctor Account`,
            data:{
                doctorId:newDoctor._id,
                name:newDoctor.firstName + " " + newDoctor.lastName,
                onClickPath:"/admin/doctors"
            }
        })
        await userModels.findByIdAndUpdate(adminUser._id,{notification})
        res.status(201).send({
            success:true,
            message:"Doctor Account Applied Successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while applying for Doctor",
            error
        })
    }
};

//Notification Controller

export const getAllNotificationController=async(req,res)=>{
    try {
        const user=await userModels.findOne({_id:req.body.userId})
        const seenNotification=user.seenNotification;
        const notification=user.notification;
        seenNotification.push(...notification);
        user.notification=[];
        user.seenNotification=notification;
        const updatedUser=await user.save();
        res.status(200).send({
            success:true,
            message:'all notification mark as read',
            data:updatedUser
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error getting notification"
        })
    }
}

//delete notification controller
export const deleteAllNotificationController=async(req,res)=>{
    try {
        const user=await userModels.findOne({_id:req.body.userId})
        user.notification=[];
        user.seenNotification=[];
        const updateUser=await user.save();
        updateUser.password=undefined;
        res.status(200).send({
            success:true,
            message:"Notification Deleted Successfully",
            data:updateUser,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'unable to delete all Notification',
            error
        })
    }
}

//get all doctors controller

export const getAllDoctorsController=async(req,res)=>{
    try {
        const doctors=await doctorModel.find({status:"approved"})
        res.status(200).send({
            success:true,
            message:"Doctors List Fetched Successfully",
            data:doctors
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in fetching all doctors list",
            error
        })
    }
}

// Book appointment Controller
export const bookAppointmentController=async(req,res)=>{
    try {
        req.body.date=moment(req.body.date,"DD-MM-YYYY").toISOString()
        req.body.time=moment(req.body.time,"Hh:mm").toISOString()
        req.body.status="pending"
        const newAppointment=new appointmentModel(req.body)
        await newAppointment.save();
        const user= await userModels.findOne({_id:req.body.doctorInfo.userId})
        user.notification.push({
            type:"New-appointment-request",
            message:`A new Appointment Request from ${req.body.userInfo.name}`,
            onClickPath:"/user/appointments"
        })
        await user.save();
        res.status(200).send({
            success:true,
            message:"Appointment Booked Successfully",
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error in booking Appointment",
            error
        })
        
    }
}

//booking availability controller
export const bookingAvailabilityController=async(req,res)=>{
    try {
        const date=moment(req.body.date,"DD-MM-YYYY").toISOString()
        const fromTime=moment(req.body.time,"HH:mm").subtract(1,"hours").toISOString()
        const toTime=moment(req.body.time,"HH:mm").add(1,"hours").toISOString()
        const doctorId=req.body.doctorId
        const appointments=await appointmentModel.find({doctorId,
            date,
            time:{
                $gte:fromTime,$lte:toTime
            }
        })
        if(appointments.length>0){
            return res.status(200).send({
                message:"Appointments not Available at this time",
                success:true
            })
        }else{
            res.status(200).send({
                success:true,
                message:"Appointments Available"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in availability checking"
        })
        
    }
}

//user Appointment controller
export const userAppoointmentsController=async(req,res)=>{
    try {
        const appointments=await appointmentModel.find({userId:req.body.userId})
        res.status(200).send({
            success:true,
            message:"Appointments Fetched Successfully",
            data:appointments
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in fetching user Appointmnets list",
            error
        })
        
    }
}