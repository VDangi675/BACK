const express = require("express")
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const bodyparser = require("body-parser");
const { json } = require("body-parser");


const router = express.Router()

router.post("/signup",
    body('email').isEmail(),
    body('password').isLength({ min: 8, max: 16 }),
    body('confirmpassword').isLength({ min: 8, max: 16 }), async (req, res) => {
        try {

            let { email, password, confirmpassword } = req.body;


            let user = await User.findOne({ email })
            if (user) {
                return res.send("user already exits")
            };



            if (password !== confirmpassword) {
                return res.json({ error: "password and confirmpassword does not match" })
            }

            let errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).j({ error: "password length should be 8" })
            }







            // user = await User.create({
            //     email:email,
            //     password:password
            // })
            // res.status(200).json({
            //     status:"Sucess",
            //     user,
            //     message:"Account is Created"
            // })

            bcrypt.hash(password, 10, async function (error, hash) {
                // It Will Store hash in the password DB.

                if (error) {
                    return res.status(500).json({
                        status: "Failed",
                        message: error.message
                    })
                }
                user = await User.create({

                    email: email,                        // It will return the user value in these format
                    password: hash
                })
                res.json({ user, message: "Account created" })

            })

        } catch (e) {
            res.status(500).json({
                status: "failed",
                message: e.message
            })
        }
    })



// router.get("/Signin",async(req,res)=>{
//     try{
//         const user = await  User.find()
//         res.send({user})


//     }catch(e){
//         res.send(e.mesage)
//     }
// })


router.post("/signin",
    body("email").isEmail(), async (req, res) => {
        try {


            let errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ err: "email is not valid" })
            }
            let { email, password } = req.body

            let user = await User.findOne({ email });
            if (!user) {
                return res.json({ error: "User does not exist" })
            }


            bcrypt.compare(password, user.password, function (err, result) {


                if (err) {
                    return res.status(500).json({
                        status: "Failed",
                        message: err.message
                    })
                }

                if (result) {
                    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
                    res.json({ user, token, message: "Logged In SuccesFully" })
                } else {
                    if (password !== user.password) {
                        return res.json({ error: "Incorrect password" })
                    }
                }
            })


        } catch (e) {
            res.status(500).json({
                status: "Failed",
                message: e.message
            })
        }
    })






module.exports = router