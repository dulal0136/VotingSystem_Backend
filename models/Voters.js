const mongoose = require('mongoose');
const validator = require('validator');


const votersSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        minLength:7,
        validate(value) {
            if(!validator.isAlpha(value)){
                throw new Error("invalid Name [Custom error]")
            }
           
        }
    },

    // vote_status:{
    //     type:Boolean,
    //     required:true
    // },

    aadhaar_id:{
        type:Number,
        required:true
    },

    voter_id:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(validator.isNumeric(value)){
               throw new Error("Invalid Voter Id [by us]")
            }
        }
    },

    address:{
        type:String,
        required:true
    },

    mobile:{
        type:Number,
        required:true,
        length:10
    },

    email:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
               throw new Error("Invalid Email [by us]")
            }
        }
    },

    password:{
        type:String,
        required:true
    },


},{versionKey:false})

const Voters = new mongoose.model('Voters',votersSchema,'votersDb');

module.exports= Voters;