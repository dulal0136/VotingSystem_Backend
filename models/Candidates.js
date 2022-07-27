const mongoose = require('mongoose');

const candidatesSchema = new mongoose.Schema({

    name: {
        type:String,
        required:true,
        minLength:8
    },


    party: {
        type:String,
        required:true

    },

}, {versionKey: false})

const Candidates = new mongoose.model('Candidates',candidatesSchema,'candidatesDb');

module.exports= Candidates;
