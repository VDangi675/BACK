const express = require("express")
const { default: mongoose } = require("mongoose")
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    title:{type:String},
    Author:{type:String},
    Ingredients:{type:String},
    Instructions:{type:String}
})

const Recipe = mongoose.model("recipe",recipeSchema)

module.exports = Recipe