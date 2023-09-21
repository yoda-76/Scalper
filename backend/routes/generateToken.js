const express = require('express');
const router = express.Router();
const brokerValidator = require("../validateBrokerCreds")
const {checkAuth}=require("../modules/auth")

router.post("/",async (req,res)=>{
    const {token, brokerName }=req.body
    // console.log(token)
    const checkAuthResponse=await checkAuth(token)
    // console.log(checkAuthResponse)
    if(!checkAuthResponse.status){
        res.status(500).json({ status: "error", msg: "jwt authintication failed" });
    }
    const userData=checkAuthResponse.data
    console.log(userData)
    var BrokerList={}
    for (const broker of userData.BrokerList) {
        // console.log(broker, userData.BrokerList.broker)
        if (broker.broker === brokerName) {
            console.log("broker",broker)
            BrokerList=broker
        }}
    const obj={
        broker_user_id : BrokerList.userId,
        broker_user_password : BrokerList.password,
        api_key : BrokerList.apiKey,
        api_secret : BrokerList.secretKey,
        totp_token : BrokerList.totp,
        redirect_url : "http://localhost:8000",
        broker_name: BrokerList.broker}
        const response=await brokerValidator(BrokerList,obj,userData.email)
        if(response.validCreds){
            res.send({status:true})
        }else{
            res.send({status:false})
        }
})

module.exports=router