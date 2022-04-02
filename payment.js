const axios = require("axios");
const https = require("https");
const btoa = require("btoa");


const express = require('express')
const app = express()

const url = "https://checkout.beem.africa/v1/checkout";
const api_key = "a91e94c5b28a9c84";
const secret_key = "NTI0M2FjMWVkNDUyZDQyYTI4MjM2ODc3NGZmNTY5ZjMyZTNhYmExN2M0NTRiZDM2ZTI1ZDBiNDM4ZTU3MmU0Yg==";
const content_type = "application/json";
const mobile ="255653448900";
const refNumb="SAID-2244";
const uuid="96f9cc09-afa0-40cf-928a-d7e2b27b2021";
const price="100";


app.post("/payment" , function(req, response){


    let payload = {
        headers: {
          "Content-Type": content_type,
          Authorization: "Basic " + btoa(api_key + ":" + secret_key),
        },
        params: {
          amount: price,
          reference_number: refNumb,
          mobile: mobile,
          sendSource: "true",
          transaction_id: uuid,
        },
      };
      
      console.log(uuid);
      
        axios
          .get(url, payload, {
            httpsAgent: new https.Agent({
              rejectUnauthorized: false,
            }),
          })
          .then((res) => {
            console.log(res);
            // sendSource as true
            if (res.request.responseURL) {
              window.location.href = res.request.responseURL;
            }
            //sendSource as false
            console.log(res.data);
            status = 200;
            //sending back a status code to the android app to allow the user to proceed
          if(status == 200){
            response.status(200).send();
          } else{
            response.status(404).send()
          }

          })
          .catch((error) => console.error(error.response.data));
      


});

app.listen(7000, () => {
    console.log("Listening on port 7000...")
})

