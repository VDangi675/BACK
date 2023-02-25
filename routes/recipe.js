
const express = require("express")
const bodyparser = require("body-parser")
const Recipe = require("../models/recipe")
const dotenv = require("dotenv")
const { isAuthenticated } = require("../auth")
const app = express()

const route = express.Router();

route.get("/recipe",(req,res)=>{
    res.send("ok google")
})



route.post("/addrecipe",isAuthenticated,async (req,res)=>{
    try{
        
      let recipe = await  Recipe.create({...req.body})
      res.json({
        recipe,
        message:"Recipe is Added"
      })
    }catch(e){
        res.status(500).json({
            status:"failed",
            message:e.message
        })
    }
})
route.get("/search/:search",async(req,res)=>{ 
    let pattern= new RegExp("^"+req.params.search)    
    let recipe = await Recipe.find({recipeID:{$regex:pattern}})
    // console.log(property,"search results")
    res.json(recipe)
})



route.put("/addrecipe/:id",async (req,res)=>{
     try{
         const recipe = await Recipe.deleteOne({id:req.params.id})  
         res.status(200).json({
            recipe,
            message:"recipe is deleted"
         })


     }catch(e){
        res.status(500).json({
            status:"failed",
            message:e.message
        })
    }
}
)

module.exports = route