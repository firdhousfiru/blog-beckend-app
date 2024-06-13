const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const { blogmodel } = require("./models/blog")
const bcrypt = require("bcryptjs")//1st after installing bcryptjs
const jwt = require("jsonwebtoken")//** 1st after jsonwebtoken
mongoose.connect("mongodb+srv://firdhouskh:kunjumol@cluster0.h3qcl.mongodb.net/blogdb?retryWrites=true&w=majority&appName=Cluster0")

const app = express()
app.use(cors())
app.use(express.json())

const generateHashedPassword = async (password) => {//2nd,3rd-added async before password after base
    const salt = await bcrypt.genSalt(10)//4th step
    return bcrypt.hash(password, salt)//5th
}
app.post("/signup", async (req, res) => {//6th make it async
    let input = req.body//7th
    let hashedPassword = await generateHashedPassword(input.password)//8th
    console.log(hashedPassword)//9th
    input.password = hashedPassword//10th 
    let blog = new blogmodel(input)
    blog.save()
    res.json({ "status": "success" })
})

app.post("/signin", (req, res) => {//11th
    let input = req.body//13
    blogmodel.find({ "emailid": req.body.emailid }).then(//14
        (response) => {//15
            //console.log(response)//16 after checking delete this sentence
            if (response.length > 0)//17
            {
                let dbPassword = response[0].password//20
                console.log(dbPassword)//21 check it 
                bcrypt.compare(input.password, dbPassword, (error, isMatch) => {//22
                    if (isMatch) {//23
                        //res.json({ "status": "success", "userID": response[0]._id })//24//** 2 cut this
                        jwt.sign({email:input.emailid},"blog-app",{expiresIn:"1d"},(error,token)=>{
                            if(error){
res.json({"status":"unable to create token"})
                            }else{
                                res.json({ "status": "success", "userID": response[0]._id, "token":token})
                            }
                        })
                        
                    } else {//25
                        res.json({ "status": "incorrect" })//26
                    }
                })
            }
            else {//18
                res.json({ "status": "user not found" })//19
            }
        }
    ).catch()


    // res.json({"status":"success"})//12th after runnin in post man delete this sentence
})

app.listen(3030, () => {
    console.log("SERVER STARTED")
})