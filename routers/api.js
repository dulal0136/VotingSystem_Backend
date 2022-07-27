const express = require('express');
const router = express.Router(); 
const parser = require('body-parser');
const mongoose =require('mongoose'); 
const nodemailer =require('nodemailer');
const Admin = require('../models/Admin');
const bcrypt =require('bcrypt');
const Candidates = require('../models/Candidates');
const Voters = require('../models/Voters');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');





// Connection With MongoDb 
mongoose.connect("mongodb://127.0.0.1:27017/adminDb", {  
useNewUrlParser: true,
useUnifiedTopology: true 
}).then(()=> {
console.log('Mongodb connection successful');

}).catch((err)=>{
    console.log(err);
});





// Admin Add : Register
router.post('/adminRegister',(req,res)=>{

    //adminModel.name = req.body.name;
    //adminModel.email = req.body.email;
    //adminModel.mobile = req.body.mobile;
    //adminModel.password = req.body.password;

    let name = req.body.name;
    let email = req.body.email;
    let mobile = req.body.mobile;
    let password = req.body.password;

  //let registerTime = new Date().getTime();
    
    const saltRounds = 12;
    let adminModel = new Admin();

    bcrypt.genSalt(saltRounds, (err,salt)=>{
        bcrypt.hash(password, salt , (err , hash )=>{
            adminModel.name=name;
            adminModel.email=email;
            adminModel.mobile=mobile;
            adminModel.password=hash;

            adminModel.save().then(() => {
            // res.status(202).json({ message: "Registered Successfully", registerTime :adminModel.registerTime });
            res.status(202).json({ message: "Registered Successfully" });
            })
            .catch((err) => {
            res.status(400).json({ message: err });
            });
        });
    });
});

        




// Admin View : Fetching all admin details 
router.get('/adminView',(req,res)=>{
    Admin.find({}).then((data)=>{
        res.status(202).json({AdminList:data});
    }).catch((err)=>{
        res.status(400).json({message:err})
    });
});






// Admin View By ID : Fetching details by ID
router.get('/adminView/:id',(req, res) => {
    Admin.findById(req.params.id).exec().then((data) => {
        res.status(202).json({ AdminList: data });
      }).catch((err) => {
        res.status(400).json({ message: err});
    });
});





// Admin Update : PUT Request
router.put('/adminUpdate/:id',(req,res)=>{
    Admin.findByIdAndUpdate(req.params.id,{
        $set:{
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            password:req.body.password
        }
    }).then(()=>{
        res.status(202).json({message:'Admin value updated'});
    }).catch((err)=>{
        res.status(400).json({message:err});
    });
});






// Delete Request
router.delete('/adminDelete/:id',(req,res)=>{
    Admin.findByIdAndDelete(req.params.id).then(()=>{
        res.status(202).json({message:'Value deleted'})
    }).catch((err)=>{
        res.status(400).json({message:err})
    });
});






// Admin Login
router.post('/adminLogin',  (req, res)=>{
    let email = req.body.email;
    let password = req.body.password;
    //let lastLogin = (new Date().getTime()
    
    Admin.findOne({email:email}).then((Admin)=>{
        if(Admin === null){
            res.status(200).json({message: ' Admin Not Found '});
        }else{
            const hashPass = Admin.password;
            bcrypt.compare(password , hashPass , (err, result)=>{
                if(result){
                const token = jwt.sign({name:Admin.name,email:Admin.email},'vote',{expiresIn:'1h'})
                res.status(202).json({message:'Login Successful',name:Admin.name,email:Admin.email});

                    // res.status(202).json({message:'Successfully Logged In'});

                    
                }else{

                    res.status(400).json({message: 'Please Enter Your Correct Password'});
                }
            })
        }
    });
});









//Election Candidate Add: Admin can Add Candidates//
router.post('/candidatesAdd', (req, res) => {

    let candidatesModel = new Candidates();

    candidatesModel.name = req.body.name;
    candidatesModel.party = req.body.party;

    candidatesModel.save().then(() => {
        res.status(200).json({message: " Election Candidate Added Successfully"});
    }).catch(err => {
        res.status(400).json({message: err});
    });
});





//Election Candidate View: Admin can view list of election candidates//
router.get('/candidatesView', (req, res) => {
    Candidates.find({}).then((data)=>{
        res.status(202).json({CandidatesList:data});
    }).catch((err)=>{
        res.status(400).json({message:err})
    });
});





//Election Candidate View: By ID//
router.get('/candidatesView/:id',(req, res) => {
    Candidates.findById(req.params.id).exec().then((data) => {
        res.status(202).json({ AdminList: data });
      }).catch((err) => {
        res.status(400).json({ message: err});
    });
});





//Update Data Of Election Candidate: By Admin//
router.put('/candidatesUpdate/:id',(req,res)=>{
    Candidates.findByIdAndUpdate(req.params.id,{
        $set:{
            name:req.body.name,
            party:req.body.party
        }
    }).then(()=>{
        res.status(202).json({message:'Candidate Value Updated'});
    }).catch((err)=>{
        res.status(400).json({message:err});
    });
});





//Delete Data Of Election Candidates: By Admin//
router.delete('/candidatesDelete/:id',(req,res)=>{
    Candidates.findByIdAndDelete(req.params.id).then(()=>{
        res.status(202).json({message:'Value Deleted'});
    }).catch((err)=>{
        res.status(400).json({message:err});
    });
});









//Voters Add : By Admin//
router.post('/votersAdd', (req, res)=>{

   
    // votersModel.name = req.body.name;
    // votersModel.aadhaar_id = req.body.aadhaar_id;
    // votersModel.voter_id = req.body.voter_id;
    // votersModel.address = req.body.address;
    // votersModel.mobile = req.body.mobile;
    // votersModel.email = req.body.email;
    // votersModel.password = req.body.password;

   
    let name = req.body.name;
    let aadhaar_id = req.body.aadhaar_id;
    let voter_id = req.body.voter_id;
    let address = req.body.address;
    let mobile = req.body.mobile;
    let email = req.body.email;
    let password = req.body.password;

    const saltRounds = 12;
    let votersModel = new Voters();

   bcrypt.genSalt(saltRounds, (err,salt) => {
    bcrypt.hash(password, salt , (err , hash ) => {
        votersModel.name = name;
        votersModel.aadhaar_id = aadhaar_id;
        votersModel.voter_id = voter_id;
        votersModel.address = address;
        votersModel.mobile = mobile;
        votersModel.email = email;
        votersModel.password = hash;

        votersModel.save().then(()=>{
            res.status(200).json({message: "Voter Candidate Added Successfully"});
        }).catch(err => {
            res.status(400).json({message: err});
        });
    });
   });
});





//Voters View : View By Admin//
router.get('/votersView', checkAuth,(req, res) => {
    Voters.find({}).then((data)=>{
        res.status(202).json({VotersList:data});
    }).catch((err)=>{
        res.status(400).json({message:err})
    });
});





//Voters Update: Update By Admin//
router.put('/votersUpdate/:id',checkAuth,(req,res)=>{
    Voters.findByIdAndUpdate(req.params.id,{
        $set:{
            name:req.body.name,
            aadhaar_id:req.body.aadhaar_id,
            voter_id:req.body.voter_id,
            address:req.body.address,
            mobile:req.body.mobile,
            email:req.body.email, 
            password:req.body.password
        }
    }).then(()=>{
        res.status(202).json({message:'Voters Information Updated'});
    }).catch((err)=>{
        res.status(400).json({message:err});
    });
});





//Voters Delete: Delete By Admin//
router.delete('/votersDelete/:id',checkAuth,(req,res)=>{
    Voters.findByIdAndDelete(req.params.id).then(()=>{
        res.status(202).json({message:'Voters Information Deleted'});
    }).catch((err)=>{
        res.status(400).json({message:err});
    });
});





//Voters Login: Voters Can cast Vote And Check Status//
router.post('/votersLogin',checkAuth, (req, res)=>{

    let voter_id = req.body.voter_id;
    let password = req.body.password;
    
    Voters.findOne({voter_id:voter_id}).then((Voters)=>{
        if(Voters === null){
            res.status(200).json({message: ' Voter Not Found '});
        }else{
            const hashPass = Voters.password;
            bcrypt.compare(password , hashPass , (err, result)=>{
                if(result){

                    const token = jwt.sign({voter_id:Voters.voter_id,password:Voters.password},'vote',{expiresIn:'1h'});
                    res.status(202).json({message:'Successfully Logged In',name:Voters.name,token:token});

                // res.status(202).json({message:'Successfully Logged In'});
                    
                }else{

                res.status(400).json({message: 'Please Enter Your Correct Password'});
                }
            })
        }
    });
});



module.exports = router;