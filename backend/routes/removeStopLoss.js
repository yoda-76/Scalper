const express = require('express');
const router = express.Router();
const KiteConnect = require("kiteconnect").KiteConnect;
const {checkAuth}=require("../modules/auth")

router.post("/", async (req, res) => {
    const {symbol, qty, transaction_type,product,variety, token,price, trigger_price, exchange } = req.body;
    console.log({symbol, token } )
    try {
        const checkAuthResponse = await checkAuth(token)
        if(!checkAuthResponse.status){
            res.status(500).json({ status: "error", msg: "jwt authintication failed" });
        }
        const { accessToken, apiKey } = checkAuthResponse.data.BrokerList.find(broker => broker.broker === "Zerodha");
        const access_token = accessToken;
        const api_key = apiKey;

        const kite = new KiteConnect({ api_key });
        kite.setAccessToken(access_token);
        const orderbook=await kite.getOrders()
        console.log(typeof orderbook, orderbook)
        orderbook.map(order=>{
            if(order.tradingsymbol===symbol && order.status==="TRIGGER PENDING"){
                kite.cancelOrder("regular", order.order_id)
            }
        })
    }
    catch(err){
        console.log(err)
        res.send({status:false});
    }
})
module.exports=router