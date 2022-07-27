const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{
    try{
        const decodeToken = jwt.verify(req.query.token,'vote')
        req.userData=decodeToken
    }catch(err){
        return res.status(200).json({message:"token missing or expired"})
    }
    next();
};