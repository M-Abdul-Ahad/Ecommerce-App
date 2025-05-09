import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import express from 'express'

export const registerUser=async (req,res)=>{
    const {name,email,password}=req.body
    const checkUser=await User.findOne({email})
   
    try{    
        if(checkUser){
            return res.status(400).json({
                success:false,
                message:'User Already Exists !'
            });
        }
        const hashedPassword=await bcrypt.hash(password,12)
        const newUser=new User({
            name,
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

export const loginUser=async (req,res)=>{
    const {email,password}=req.body
    const checkUser=await User.findOne({email})
   
    try{
        if(!checkUser){
            return res.status(400).json({
                success:false,
                message:'User dont exists! Register First'
            });
        }
        const checkPassword= await bcrypt.compare(password,checkUser.password)
        if(!checkPassword){
            return res.status(400).json({
                success:false,
                message:'Incorrect Password! Please Try Again'
            });
        }
        const token=jwt.sign({
            id:checkUser._id, role:checkUser.role, email:checkUser.email,name:checkUser.name
        },'CLIENT_SECRET_KEY',{expiresIn:'60m'})
        
        res.cookie('token',token,{httpOnly:true, secure:false}).json({
            success:true,
            message:'Logged In Successfully',
            user:{
                email:checkUser.email,
                role:checkUser.role,
                id:checkUser._id,
                name:checkUser.name
            }
        })
   
    }catch(error){
        console.log('error occuring in login:  ',error)
        res.status(500).json({
            success:false,
            message:'Error while Login User!'
        })
    }
}

export const logoutUser=async(req, res)=>{
    res.clearCookie("token").json({
        success:true,
        message:'Logged Out Successfully'
    })
}

export const authMiddleware=async (req,res,next)=>{
    const token=req.cookies.token
    if(!token){
        return res.status(401).json({
            success:false,
            message:'User in not Authenticated'
        })
    }
    try{
        const decodedToken=jwt.verify(token,'CLIENT_SECRET_KEY')
        req.user=decodedToken
        next()
    }catch(e){
        console.log('error in authMiddleware',error)
        res.status(401).json({
            success:false,
            message:'Unauthenticated User'
        })
    }
}