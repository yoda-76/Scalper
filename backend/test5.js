// const KiteConnect = require("kiteconnect").KiteConnect;
const KiteTicker = require("kiteconnect").KiteTicker;
const fs = require('fs');
const path = require('path');

const readTokensFromFile = () => {
  // Specify the file path from where to read the data
  const filePath = path.join(__dirname, 'tokens.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
    } else {
      try {
        // Parse the JSON data into an array
        const arrayOfTokens = JSON.parse(data);
        return arrayOfTokens;


    //   const a = async () => {
    //     const ticker = new KiteTicker({ api_key, access_token });
        
    //     function onTicks(ticks) {
    //       console.log("Ticks", ticks);
    //       ws.send(JSON.stringify(ticks));
    //       // const instrumentTokens = clientInstrumentMap.get(ws);
    //       // if (instrumentTokens && instrumentTokens.includes(ticks[0].instrument_token)) {
    //         //   // Send the ticks data to the current client
    //         //   // console.log("got it")
    //         // }
    //       }
          
    //       function subscribe(instrumentToken) {
    //         // console.log("inside subscribe", instrumentToken)
    //         // console.log(instrumentToken)
    //         var items = instrumentToken;
    //         ticker.subscribe(instrumentToken);
    //         // instoken = ticker.subscribe(items);
    //         // console.log(ticker.subscribe(items), "hello");
            
    //         ticker.setMode(ticker.modeQuote, items);
    //       }
          
    //       // function unsubscribe(instrumentToken) {
    //         //   let instrumentTokens = clientInstrumentMap.get(ws);
    //         //   console.log(instrumentTokens, "up");
    //         //   console.log(instoken, "instoken");
    //         //   if (instrumentTokens) {
    //           //     const index = instrumentTokens.indexOf(Number(instrumentToken));
    //           //     if (index > -1) {
    //             //       instrumentTokens.splice(index, 1);
    //             //       ticker.unsubscribe(instoken);
    //             //     }
    //             //   }
    //             // }
                
    //             ticker.connect();
    //             ticker.on("connect", () => {
    //               // Extract the previous instrument token
    //               // const previousInstrumentToken = clientInstrumentMap.get(ws);
    //               // if (previousInstrumentToken) {
    //                 //   unsubscribe(previousInstrumentToken[0]); // Unsubscribe from the previous instrument token
    //                 // }
    //                 ticker.on("connect", ()=>{subscribe(arrayOfTokens);}); // Subscribe to the newly selected instrument token
    //                 // clientInstrumentMap.set(ws, [Number(instrumentToken)]); // Update the instrument token mapping
    //     });
    //     ticker.on("ticks", onTicks);
    //   };

    //   a();
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
  });
};
const arrayOfTokens=[8963586,8963842,10227202]
// console.log( arrayOfTokens)

// var KiteTicker = require("kiteconnect").KiteTicker;
var ticker = new KiteTicker({
    api_key: "elrfps73mpn9aou4",
    access_token: "G1wmukgRdwOVobTrTKhvc6tLcXPiM1c6"
});

ticker.connect();
ticker.on("ticks", onTicks);
ticker.on("connect", subscribe);

function onTicks(ticks) {
    console.log("Ticks", ticks);
}

function subscribe() {
    var items = arrayOfTokens;
    ticker.subscribe(items);
    ticker.setMode(ticker.modeFull, items);
}
