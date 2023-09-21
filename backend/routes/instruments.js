const KiteTicker = require("kiteconnect").KiteTicker;
const KiteConnect = require("kiteconnect").KiteConnect;
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const server = require("http").createServer(app);
const WebSocket = require('ws');
const router = express.Router();
const User = require("../models/userDetails"); 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require('axios');
const csvtojson = require('csvtojson');
const cron = require('node-cron');
const { json } = require("body-parser");
const JWT_SECRET = "slkdfjlasdfkajsdlkfaksdflaksdjfoajsdofjodsf";
let instoken;
let tokenData = fs.readFileSync(path.join(__dirname, 'data/instrumentToken.json'), 'utf8');
// const instrumentDataPath = path.join(dataDir, 'instrument.json');

// console.log(tokenData)
let instrumentsData = [];
 
// Create a directory 'data' to store the instrument.json file
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Function to download the file, convert to JSON, and store it in instrument.json
const downloadInstrumentsData = async () => {
  try {
    const url = 'https://api.kite.trade/instruments';
    const response = await axios.get(url);
    const jsonData = await csvtojson().fromString(response.data);
    // console.log(jsonData, "json data");

    // Filter the jsonData array based on the given conditions
    const filteredData = jsonData.filter(item => {
      return (
        item.name === "NIFTY" ||
        item.name === "BANKNIFTY" ||
        item.name === "FINNIFTY"
      );
    });

    const tokenData = filteredData.map(item => item.instrument_token);

    const tradingSymbolData = filteredData.map((item, index) => ({
      id: index + 1,
      name: item.tradingsymbol.replace(/Y|(?=\d{5}(?=CE|PE|FUT))|(?=CE|PE|FUT)/g, "$& ")
      ,
    }));

    // Store the filtered instruments data in instrument.json
    fs.writeFileSync(
      path.join(dataDir, 'instrument.json'),
      JSON.stringify(filteredData, null, 2)
    );

    fs.writeFileSync(
      path.join(dataDir, 'instrumentToken.json'),
      JSON.stringify(tokenData, null, 2)
    );

    fs.writeFileSync(
      path.join(dataDir, 'instrumentTradingSymbol.json'),
      JSON.stringify(tradingSymbolData, null, 2)
    );

    console.log('Instruments data downloaded, filtered, and stored in instrument.json.');
    // console.log(tokenData);

  } catch (error) {
    console.error('Error downloading or converting instruments data:', error);
  }
};

// downloadInstrumentsData()
// Read instruments data from instrument.json on server start
const instrumentDataPath = path.join(dataDir, 'instrument.json');
if (fs.existsSync(instrumentDataPath)) {
  const jsonData = fs.readFileSync(instrumentDataPath, 'utf-8');
  instrumentsData = JSON.parse(jsonData).map(instrument => ({
    ...instrument,
    expiry: instrument.expiry, // Convert the expiry date to a JavaScript Date object
  }));
  console.log('Instruments data loaded from instrument.json.');
} else {
  console.log('Instruments data not found. Downloading...');
  // downloadInstrumentsData();
}

// Set up a cron job to download the file once every day (adjust the cron schedule as needed)
cron.schedule('0 0 * * *', downloadInstrumentsData); // This runs the function at midnight every day

router.post("/getInstruments", async (req, res) => {
  const { selected, token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const { email } = user;

    const jsonData = await User.findOne({ email });

    // Extract the access token
    const { accessToken, apiKey } = jsonData.BrokerList.find(broker => broker.broker === "Zerodha");
    const access_token = accessToken;
    const api_key = apiKey;

    const a = async () => {
      const kite = new KiteConnect({ api_key });
      kite.setAccessToken(access_token);

      const orderbook = await kite.getOrders();
      const tradebook= await kite.getTrades()
      const positions= await kite.getPositions()
      const ohlc=await kite.getOHLC(["NSE:NIFTY 50", "NSE:NIFTY BANK","NSE:NIFTY FIN SERVICE"])
      let atm={}
      for (const key in ohlc){
        if(key==="NSE:NIFTY 50"||key==="NSE:NIFTY FIN SERVICE"){
          atm[key]=Math.round(ohlc[key].last_price/50)*50
        }else{
          atm[key]=Math.round(ohlc[key].last_price/100)*100
        }
      }
      // console.log(tradebook, "tradebook");
      // console.log(positions, "positions");

      // Perform any kite operations here
      const instruments = await kite.getInstruments(["NFO"]);
      const margins=await kite.getMargins()
      // console.log(instruments, "instruments");
      const currentDate = new Date();

const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0');
const day = String(currentDate.getDate()).padStart(2, '0');

const formattedDate = `${year}-${month}-${day}`;


      const filteredInstruments = instrumentsData.filter(
        (instrument) =>
          instrument.name === (selected.name || selected) &&
          instrument.segment === 'NFO-OPT'      );
      
      const uniqueExpiryDates = Array.from(
        new Set(filteredInstruments.map((instrument) => instrument.expiry))
      ).filter((expiryDate) => expiryDate >= formattedDate); 
      
      const uniqueStrikes = Array.from(
        new Set(
          filteredInstruments.map((instrument) => instrument.strike)
        )
      );
      const optionsToken=Array.from(
        new Set(
          filteredInstruments.map((instrument) => instrument.instrument_token)
        )
      );

      console.log(atm)


      // Send the response to the client
      res.send({atm,ohlc,margins, uniqueExpiryDates, instruments, uniqueStrikes, orderbook,tradebook, positions, accountName: jsonData.BrokerList[0].accountName });
    };

    a();
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
});

// WebSocket server code
const wss = new WebSocket.Server({ server });

// Store the WebSocket connection and ticker mapping for each client
const clientTickerMap = new Map();

wss.on('connection', (ws) => {
  const subscribedInstruments = [];

  console.log('Client connected');
  var ticker, Token;

  ws.on('message', async (message) => {
    const initialData = JSON.parse(message);
    const { token, instrumentToken, email } = initialData;
    // console.log(instrumentToken)

    // Use the received data (token, instrumentToken, email) for further processing or to retrieve the required tick data
    try {
      const user = jwt.verify(token, JWT_SECRET);
      const { email } = user;
      console.log(email);
      const jsonData = await User.findOne({ email });

      // Extract the access token
      const { accessToken, apiKey } = jsonData.BrokerList.find(broker => broker.broker === "Zerodha");
      const access_token = accessToken;
      const api_key = apiKey;
      console.log("access_token",access_token)

      const a = async () => {
        
        const ticker = new KiteTicker({ api_key, access_token });
        
        function onTicks(ticks) {
          // console.log("Ticks", ticks.length);
          ws.send(JSON.stringify(ticks));
          // const instrumentTokens = clientInstrumentMap.get(ws);
          // if (instrumentTokens && instrumentTokens.includes(ticks[0].instrument_token)) {
            //   // Send the ticks data to the current client
            //   // console.log("got it")
            // }
          }
          
          function subscribe() {
            console.log(typeof tokenData)
            tokenData= JSON.parse(tokenData).map(Number);
            // console.log("inside subscribe", instrumentToken)
            const middleIndex = Math.floor(tokenData.length / 2);
            
            const firstHalf = tokenData.slice(0, middleIndex);
            const secondHalf = tokenData.slice(middleIndex);
            console.log(firstHalf.length, secondHalf.length)
            // ticker.subscribe(firstHalf);
            // ticker.setMode(ticker.modeQuote, firstHalf);
            // ticker.subscribe(secondHalf);
            // ticker.setMode(ticker.modeQuote, secondHalf);
            ticker.subscribe(tokenData);
            ticker.setMode(ticker.modeQuote, tokenData);
          }
          
          // function unsubscribe(instrumentToken) {
            //   let instrumentTokens = clientInstrumentMap.get(ws);
            //   console.log(instrumentTokens, "up");
            //   console.log(instoken, "instoken");
            //   if (instrumentTokens) {
              //     const index = instrumentTokens.indexOf(Number(instrumentToken));
              //     if (index > -1) {
                //       instrumentTokens.splice(index, 1);
                //       ticker.unsubscribe(instoken);
                //     }
                //   }
                // }
                
                ticker.connect();
                ticker.on("connect", () => {
                    subscribe(); 
        });
        ticker.on("ticks", onTicks);

      };

      a();
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  });

  ws.on('close', () => {
    // Close the ticker instance for this client when the WebSocket connection is closed
    const ticker = clientTickerMap.get(ws);
    if (ticker) {
      ticker.disconnect();
      clientTickerMap.delete(ws);
    }
  });
});

server.listen(7000, () => {
  console.log('Server started on port 7000');
});

module.exports = router;