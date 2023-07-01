import doctorModel from "../models/doctorModel.js";
import userModels from "../models/userModels.js";


//Get All users controllers
export const getAllUsersController=async(req,res)=>{
    try {
        const users=await userModels.find({});
        res.status(200).send({
            success:true,
            message:"users data list",
            data:users
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error while fetching users",
            error,
        })
    }
}

//get all doctor controller
export const getAllDoctorsController=async(req,res)=>{
    try {
        const doctors=await doctorModel.find({});
        res.status(200).send({
            success:true,
            message:"doctors data list",
            data:doctors
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while fetching Doctors",
            error,
        })
    }
}


//doctor Account Status

export const changeAccountStatusController=async(req,res)=>{
    try {
        const {doctorId, status}=req.body;
        const doctor =await doctorModel.findByIdAndUpdate(doctorId,{status})
        const user=await userModels.findOne({_id:doctor.userId})
        const notification=user.notification;
        notification.push({
            type:"doctor-account-request-updated",
            message:`Your Doctor Account Request has ${status}`,
            onClickPath:"/notification"
        })
        user.isDoctor=status==="approved"? true:false;
        await user.save();
        res.status(200).send({
            success:true,
            message:"Doctor Account Updated",
            data:doctor
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in Acoount Status",
            error
        })
    }
}