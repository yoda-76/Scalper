const KiteTicker = require("kiteconnect").KiteTicker;
const express = require('express');
const app = express();
const jwt = require("jsonwebtoken");
const router = express.Router();
const JWT_SECRET = "slkdfjlasdfkajsdlkfaksdflaksdjfoajsdofjodsf";
const KiteConnect = require("kiteconnect").KiteConnect;
const {checkAuth}=require("../modules/auth")

router.post("/", async (req, res) => {
    const {lotSize,switchQty, symbol, qty, transaction_type,product,variety, token, } = req.body;
    console.log({symbol, qty, transaction_type,product,variety, token, } )
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
        function regularOrderPlace(variety) {
            kite.placeOrder(variety, {
                    "exchange": "NFO",
                    "tradingsymbol": symbol,
                    "transaction_type": transaction_type,
                    "quantity": switchQty&&qty || qty*lotSize,
                    "product": product,
                    "order_type": "MARKET"
                }).then(async function(resp) {
                    console.log("33",resp);
                    const orderbook=await kite.getOrders()
                    if(orderbook[orderbook.length-1].status==="COMPLETE"){

                        res.send({status:true,data:resp});
                    }
                    else{
                        
                        res.send({status:false, data:{message:"Maybe due to insufficient funds. Check your balance and all the input fields again. ;)"}});

                    }
                }).catch(err=>{
                    res.send({status:false,data:err})
                })
        }
       regularOrderPlace(variety);

    
    }
    catch(err){
        console.log(err)
        res.send({status:false});
    }
})
module.exports=router