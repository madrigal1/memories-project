
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '../models/userSchema.js'
export const signin = async (req,res)=>{
    const {email,password} = req.body;
    try {
        //check user
        const existingUser = await User.findOne({email});
        if(!existingUser) return res.status(404).json({message:"User doesn't exist"});


        //check password
        const isPassword = await bcrypt.compare(password,existingUser.password);
        if(!isPassword) return res.status(400).json({message:"Invalid Credentials"});

        //make token 
        const token = jwt.sign({email:existingUser.email,id:existingUser._id},'test',{expiresIn:"1h"});

        return res.status(200).json({result:existingUser,token});
    }catch(err) {
        return res.status(500).json(err);
    }
}

export const signup = async (req,res)=> {
    const {email,password,confirmPassword,firstName,lastName} = req.body;

    try {
        //check if exisitng user
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(404).json({message:"User already exists"});

        //check if password !== confirm password
        if(password !== confirmPassword)
            return res.status(400).json({message:"User's password  don't match"});
        //hashpwd
        const hashedPwd = await bcrypt.hash(password,12);

        //create user 
        const result = await User.create({
            email,
            password:hashedPwd,
            name: `${firstName} ${lastName}`,
        });
        //token
        const token = jwt.sign({email:result.email,id:result._id},'test',{expiresIn:"1h"});
        return res.status(200).json({result,token});
    }catch(err) {
        return res.status(500).json(err);
    }
}