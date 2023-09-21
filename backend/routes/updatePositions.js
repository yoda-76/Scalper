const KiteTicker = require("kiteconnect").KiteTicker;
const express = require('express');
const app = express();
const jwt = require("jsonwebtoken");
const router = express.Router();
const JWT_SECRET = "slkdfjlasdfkajsdlkfaksdflaksdjfoajsdofjodsf";
const KiteConnect = require("kiteconnect").KiteConnect;
const {checkAuth}=require("../modules/auth")

router.post("/", async (req, res) => {
    const {token} = req.body;
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
        const positions=await kite.getPositions()
        const orderbook=await kite.getOrders()
        const tradebook=await kite.getTrades()
        res.send({positions,orderbook,tradebook})
    
    }
    catch{
        res.send({status:false});
    }
})
module.exports=router