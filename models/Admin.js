const mongoose = require('mongoose');
const validator = require('validator');


const adminSchema = new mongoose.Schema({

    name: {
        type:String,
        required:true,
        minLength:5,
        validate(value){
            if(!validator.isAlpha(value)){
               throw new Error("invalid Name [Custom error]")
            }
        }
    },


    email: {
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
               throw new Error("Invalid Email [by us]")
            }
        }
    },


    mobile: {
        type: Number,
        required:true,
        length:10
    },


    password: {
        type:String,
        required:true,
    }, 
    

    lastLoginDate: {
        type: Date,
        default: Date.now()
    },

}, {versionKey: false})
adminSchema.statics.newLogin = function login(id, callback) {
    return this.findByIdAndUpdate(id,
         { '$set':{ 'lastLogin': Date.now().getTime() } }, 
         { new: true }, callback);
};


const Admin = new mongoose.model('Admin',adminSchema,'adminDb');

module.exports= Admin;