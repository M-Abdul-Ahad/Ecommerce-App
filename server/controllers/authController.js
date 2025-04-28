import bcrypt from 'bcryptjs'
import User from '../models/User'

export const registerUser=async (req,res)=>{
    const {userName,email,password}=req.body
    try{
        const hashedPassword=await bcrypt.hash(password,12)
        const newUser=new User({
            userName,
            email,
            password:hashedPassword
        })
        await newUser.save()
        res.status(200).json({
            success:true,
            message:'User Registered Successfully!!!'
        })
    }catch(error){
        console.log('error occuring in register user:  ',error)
        res.status(500).json({
            success:false,
            message:'Error while Registering User!'
        })
    }
}