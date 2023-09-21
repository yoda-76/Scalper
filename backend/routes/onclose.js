const KiteConnect = require("kiteconnect").KiteConnect;
const express = require('express');
const router = express.Router();
const {checkAuth}=require("../modules/auth")


router.post("/", async(req,res)=>{
    try{const {token, watchlist}=req.body
    const checkAuthResponse=await checkAuth(token)
    if(!checkAuthResponse.status){
        res.status(500).json({ status: "error", msg: "jwt authintication failed" });
    }
    const userData=checkAuthResponse.data
    // console.log(userData)   
    const api_key=userData.BrokerList[0].apiKey
    const access_token=userData.BrokerList[0].accessToken
    // console.log(api_key, access_token)
    
    }catch(err){
        console.log(err)
    }
})

module.exports=router