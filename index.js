const express = require("express");
const mongoose = require("mongoose");
const {UserModel}  = require("./db");
const {jwt} = require("jsonwebtoken");
const { z }   =  require("zod");
require("dotenv").config();
const bcrypt = require("bcrypt");


mongoose.connect(process.env.MONGODB_URl);

const app = express();
app.use(express.json());


app.post("/signup",  async function(req,res){

    const requiredBody = z.object({
        name: z.string().min(3).max(30),
        email:z.string().email().min(3).max(50),
        password: z.string().min(3).max(30),
    })
 
   const parsedData =  requiredBody.safeParse(req.body);
   if(!parsedData.success){
    res.json({
        message:"incorrect format",
        error: parsedData.error
    }
    )
    return
    
   }

   

    try{
     
    const {name,email,password} = req.body;

    
    const hashed =  await  bcrypt.hash(password,10);
    console.log(hashed);
    await UserModel.create({
        name:name,
        email:email,
        password:hashed

    }) 
    res.json({
        message:"you are signed up !!"
    })

}catch(e){
    res.json("error while signing up !!")
}


})



app.post("/signin",async function(req,res){


      try{
    const {email,password} = req.body;
    const user =  await UserModel.findOne({
             email
    })
    const passwordMatch = await bcrypt.compare(password,user.password);
    
    if(user && passwordMatch){
        const token = jwt.sign({},process.env.SECRET_KEy);
        res.json(token);
    }else{
        res.json("incorrect credentials");
    }
}catch(e){
    res.json("there was some error signing in !!")
}


})








if(mongoose.connect){
    console.log("working !!");
    app.listen(3000);
}

