import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import postsRoutes from './routes/posts.js'
import userRoutes from './routes/users.js'

import dotenv from 'dotenv'

const app = express();
dotenv.config();


app.use(express.json({limit:"30mb",extended:true}));
app.use(express.urlencoded({limit:"30mb",extended:true}))
app.use(cors());


const CONNECTION_URL  = process.env.CONNECTION_URL || "";

const PORT  = process.env.PORT || 5000;

app.use("/posts",postsRoutes);
app.use("/user",userRoutes);

app.get("/",(req,res)=>res.send("Memories Api v1.0"));
 

mongoose.connect(CONNECTION_URL,{useNewUrlParser:true,useUnifiedTopology:true})
    .then(()=>app.listen(PORT,()=>{
        console.log(`Server running on port: ${PORT}`);
    }))
    .catch(err=>console.error(err));
mongoose.set('useFindAndModify',false);
