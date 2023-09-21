const KiteConnect = require("kiteconnect").KiteConnect;
const express = require('express');
const router = express.Router();
const { checkAuth } = require("../modules/auth");

router.post("/", async (req, res) => {
  const { token } = req.body;
  const checkAuthResponse = await checkAuth(token);
  if (!checkAuthResponse.status) {
    return res.status(500).json({ status: "error", msg: "jwt authentication failed" });
  }

  const userData = checkAuthResponse.data;
  console.log(userData);

  try {
    const api_key = userData.BrokerList[0].apiKey;
    const access_token = userData.BrokerList[0].accessToken;
    console.log(api_key, access_token)
    const kite = new KiteConnect({ api_key });
    kite.setAccessToken(access_token);
    const position = await kite.getPositions();


    // Use map function to create an array of promises from kite.placeOrder calls
    position['day'].map(async (position) => {
      const variety = "regular";
      const orderParams = {
        exchange: position.exchange,
        tradingsymbol: position.tradingsymbol,
        quantity: Math.abs(position.quantity),
        product: position.product,
        order_type: "MARKET",
      };

      // Check for transaction_type to decide whether it's a BUY or SELL order
      if (position.quantity>0) {
        orderParams.transaction_type = "SELL";
      } else if(position.quantity<0) {
        orderParams.transaction_type = "BUY";
      }else{
        return
      }

      // Return the placeOrder promise
     try{await kite.placeOrder(variety, orderParams);}catch(err){console.log("46",err )}
    });

    // Use Promise.all to wait for all placeOrder promises to resolve or reject
    console.log("squared off")
    res.send({status:true})
  } catch (err) {
    console.log("error 60",err)

    res.send({ status: false, error: err });
  }
});

module.exports = router;