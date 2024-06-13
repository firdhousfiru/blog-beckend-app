const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const {blogmodel}=require("./models/blog")
const bcrypt=require("bcryptjs")//1st after installing bcryptjs
mongoose.connect("mongodb+srv://firdhouskh:kunjumol@cluster0.h3qcl.mongodb.net/blogdb?retryWrites=true&w=majority&appName=Cluster0")

const app=express()
app.use(cors())
app.use(express.json())

const generateHashedPassword=async(password)=>{//2nd,3rd-added async before password after base
const salt=await bcrypt.genSalt(10)//4th step
return bcrypt.hash(password,salt)//5th
}
app.post("/signup",async(req,res)=>{//6th make it async
    let input=req.body//7th
let hashedPassword= await generateHashedPassword(input.password)//8th
console.log(hashedPassword)//9th
input.password=hashedPassword//10th 
let blog = new blogmodel(input)
blog.save()
    res.json({"status":"success"})
})

app.listen(3030,()=>{
    console.log("SERVER STARTED")
})