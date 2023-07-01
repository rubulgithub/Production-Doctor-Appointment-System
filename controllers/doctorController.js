import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import userModels from "../models/userModels.js";

export const getDoctorInfoController=async(req,res)=>{
    try {
        const doctor=await doctorModel.findOne({userId:req.body.userId})
        res.status(200).send({
            success:true,
            message:'doctor data successfully fetched',
            data:doctor
        });
    } catch (error) {
        console.log(error);
        res.statu(500).send({
            success:false,
            message:"Error in fetching doctor details",
            error
        })
        
    }
}

//update doc controller

export const updateProfileController=async(req,res)=>{
    try {
        const updatedDoctor=await doctorModel.findOneAndUpdate({userId:req.body.userId},req.body);
        res.status(201).send({
            success:true,
            message:"Doctor Profile Updated Successfully",
            data:updatedDoctor,
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"Error in updating doctor Profile",
            error
        })
    }
}

//get doctor by id controller
export const getDoctorByIdController=async(req,res)=>{
    try {
        const doctor=await doctorModel.findOne({_id:req.body.doctorId})
        res.status(200).send({
            success:true,
            message:"Single doctor info fetched",
            data:doctor,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in fetching a single doctor"
        })
    }
}

//Doctor Appointment Controller
export const doctorAppointmentsController=async(req,res)=>{
    try {
        const doctor =await doctorModel.findOne({userId:req.body.userId})
        const docAppointments=await appointmentModel.find({doctorId:doctor._id})
        res.status(200).send({
            success:true,
            message:'Doctor Appointment fetched Successfully',
            data:docAppointments
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in doctor Appointments",
            error
        })
    }
}

//update Status controller

export const updateStatusController=async(req,res)=>{
    try {
        const {appointmentsId,status}=req.body;
        const appointments=await appointmentModel.findByIdAndUpdate(appointmentsId,{status})
        const user= await userModels.findOne({_id:appointments.userId})
        const notification=user.notification
        notification.push({
            type:"Status-updated",
            message:`Your Appointment status has been updated ${status}`,
            onClickPath:"/doctor-appointments"
        })
        await user.save();
        res.status(200).send({
            success:true,
            message:"Appointment Status updated"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in updating Status",
            error
        })
    }
}