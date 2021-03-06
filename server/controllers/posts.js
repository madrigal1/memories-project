import mongoose from 'mongoose';
import {postModel} from '../models/postSchema.js'

export const getPosts = async (req,res) =>{
    try {
        const postMsgs = await postModel.find({});
        return res.status(200).json(postMsgs);
    }catch(err){
        return res.status(500).json({message:err.message});
    }
};

export const createPost = async (req,res)=>{
    const post = req.body;
    const newPost = new postModel({...post,creator:req.userId,createdAt:new Date().toISOString()});
    try {
         await newPost.save();
         return res.status(200).json(newPost);
    }catch(err) {
        return res.status(500).json({message:err.message});
    }
}

export const updatePost = async(req,res) => {
    const {id:_id} = req.params;
    const post = req.body;
    if(!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send("no post with that id");
     const updatedPost = await postModel.findByIdAndUpdate(_id,{...post,_id},{new:true});

    return res.status(200).json(updatedPost);
}

export const deletePost = async(req,res) =>{
    const {id}  = req.params;
    console.log("id"+id);
    if(!mongoose.Types.ObjectId.isValid(id)){
        console.log("invalid id");
        return res.status(404).send("no post with id");
    } 
    console.log("test DLE");

    await postModel.findByIdAndRemove(id);
    return res.json({message:'Post deleted successfully'})
}

export const likePost = async(req,res)=>{
    const {id} = req.params;

    if(!req.userId) return res.json({message:"unauthenticated"});

    if(!mongoose.Types.ObjectId.isValid(id)){
        console.log("invalid id");
        return res.status(404).send("no post with id");
    } 

    const post = await postModel.findById(id);
    const index = post.likes.findIndex((id)=> id ===String(req.userId));

    if(index === -1){
        post.likes.push(req.userId);
    }else {
        post.likes = post.likes.filter((id)=>id!=String(req.userId));
    }
    const updatedPost = await postModel.findByIdAndUpdate(id,post,{new:true});

    return res.json(updatedPost);
}