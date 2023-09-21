const express = require('express');
const router = express.Router();
const KiteConnect = require("kiteconnect").KiteConnect;
const {checkAuth}=require("../modules/auth")

router.post("/", async (req, res) => {
    const {symbol, qty, transaction_type,product,variety, token,price, trigger_price, exchange } = req.body;
    console.log({symbol, qty, transaction_type,product,variety, token,price, trigger_price } )
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
        function regularOrderPlace(variety) {



            kite.placeOrder(variety, {
                    exchange,
                    "tradingsymbol": symbol,
                    "transaction_type": transaction_type,
                    "quantity": qty,
                    "product": product,
                    "order_type": "SL",
                    validity:"DAY",
                    price,
                    trigger_price
                }).then(async function(resp) {
                    console.log("33",resp);
                    const orderbook=await kite.getOrders()
                    if(orderbook[orderbook.length-1].status==="TRIGGER PENDING"){

                        res.send({status:true,data:resp});
                    }
                    else{
                        
                        res.send({status:false, data:{message:"Maybe due to insufficient funds. Check your balance and all the input fields again. ;)"}});

                    }
                }).catch(err=>{
                    console.log(err)
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