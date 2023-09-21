const KiteConnect = require("kiteconnect").KiteConnect;
const fs = require('fs');
const path = require('path');

const access_token = "WFMFWsdrhQQVu28QVePhSYz5zuY0o2o5";
const api_key = "elrfps73mpn9aou4";

const a = async () => {
  const kc = new KiteConnect({ api_key });
  kc.setAccessToken(access_token);
  const ohlc=await kc.getOHLC(["NSE:NIFTY 50", "NSE:NIFTY BANK","NSE:NIFTY FIN SERVICE"])
//   kc.placeOrder('regular', {
//     "exchange": "NSE",
//     "tradingsymbol": 'ITC',
//     "transaction_type": 'SELL',
//     "quantity": 1,
//     "product": 'MIS',
//     "order_type": "SL-M",
//     validity:"DAY",
//     price:400,
//     trigger_price:430
// }).then(async function(resp) {
//     console.log("33",resp);
//     const orderbook=await kite.getOrders()
//     if(orderbook[orderbook.length-1].status==="COMPLETE"){

//         // res.send({status:true,data:resp});
//     }
//     else{
        
//         // res.send({status:false, data:{message:"Maybe due to insufficient funds. Check your balance and all the input fields again. ;)"}});

//     }
// }).catch(err=>{
//     console.log(err)
//     // res.send({status:false,data:err})
// })
// const atm=ohlc.map((key,value)=>{
//   console.log(key, value)
// })
let atm=[]
for (const key in ohlc){
  if(key==="NSE:NIFTY 50"||key==="NSE:NIFTY FIN SERVICE"){
    atm[key]=Math.round(ohlc[key].last_price/50)*50
  }else{
    atm[key]=Math.round(ohlc[key].last_price/100)*100
  }
}


// for (const key in ohlc){
//   console.log(key,ohlc[key].)
// }


  console.log(atm)
  console.log(Math.round(44231.45/100)*100)
  // const tradeBook=kc.getTrades()
  // let buy=0, sell=0
  // tradeBook.map(trade=>{
  //   if(trade.transaction_type==='BUY'){
  //     buy+=trade.average_price*trade.quantity
  //   }else{
  //     sell+=trade.average_price*trade.quantity
  //   }
  // })

    
  
  // const arrayOfTokens = instruments.map(item => Number(item.instrument_token));

  // // Convert the array to JSON format
  // const jsonData = JSON.stringify(arrayOfTokens, null, 2);

  // // Specify the file path where you want to save the data
  // const filePath = path.join(__dirname, 'tokens.json');

  // Write the JSON data to the file
  // fs.writeFile(filePath, jsonData, 'utf8', (err) => {
  //   if (err) {
  //     console.error("Error writing file:", err);
  //   } else {
  //     console.log("Array of tokens has been saved to tokens.json");
  //   }
  // });
};

a();
