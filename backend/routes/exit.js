const KiteConnect = require("kiteconnect").KiteConnect;
const express = require('express');
const router = express.Router();
const {checkAuth}=require("../modules/auth")


router.post("/", async(req,res)=>{
    try{const {token, symbol}=req.body
    const checkAuthResponse=await checkAuth(token)
    if(!checkAuthResponse.status){
        res.status(500).json({ status: "error", msg: "jwt authintication failed" });
    }
    const userData=checkAuthResponse.data
    console.log(userData)   
    const api_key=userData.BrokerList[0].apiKey
    const access_token=userData.BrokerList[0].accessToken
    // console.log(api_key, access_token)
    const kite = new KiteConnect({ api_key });
    kite.setAccessToken(access_token)
    const positions=await kite.getPositions()
    // console.log(positions['day'])
    positions['day'].map(position=>{
        // console.log(position)
        if(position.tradingsymbol===symbol){
        if(position.quantity>0){
            console.log(Math.abs(position.quantity))
            // const quantity=if(position.quantity>0)
            const variety="regular"
            console.log("SELL", Math.abs(position.quantity))
            kite.placeOrder(variety,{
                "exchange": position.exchange,
                "tradingsymbol": symbol,
                "transaction_type": "SELL",
                "quantity": Math.abs(position.quantity),
                "product": position.product,
                "order_type": "MARKET"
            })
                .then(function(resp) {
                    console.log(resp);
                    res.send({status:true, order_id:resp})
                }).catch(function(err) {
                    console.log(err);
                    res.send({status:false, error:err})
                });
            }else if(position.quantity<0){
                    
            console.log("BUY", Math.abs(position.quantity))
            const variety="regular"
            kite.placeOrder(variety,{
                "exchange": position.exchange,
                "tradingsymbol": position.tradingsymbol,
                "transaction_type": "BUY",
                "quantity": Math.abs(position.quantity),
                "product": position.product,
                "order_type": "MARKET"
            })
                .then(function(resp) {
                    console.log(resp);
                    res.send({status:true, order_id:resp})
                }).catch(function(err) {
                    console.log(err);
                    res.send({status:false, error:err})
                });
                }
                // res.send()
            }
    })}catch(err){
        console.log(err)
    }
})

module.exports=router