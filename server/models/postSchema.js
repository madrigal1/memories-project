import mongoose from 'mongoose'

export const DOCUMENT_NAME="post";
export const COLLECTION_NAME="posts";

const postSchema = new mongoose.Schema({
    creator:String,
    name:String, 
    title:String,
    message:String,
    tags:[String],
    selectedFile:String,
    likes:{
        type:[String],
        default:[],
    },
    createdAt:{
        type:String,
        default:new Date()
    }
});

export const postModel = mongoose.model(DOCUMENT_NAME,postSchema,COLLECTION_NAME);

