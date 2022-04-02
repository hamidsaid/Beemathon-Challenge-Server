const axios = require("axios");
const https = require("https");
const btoa = require("btoa");

const content_type = "application/json";
const api_key = "";
const secret_key = "";
const msgToSend ="Get 50% off all our beverages when you order a two piece meal " + 
                "this weekend from any of our restaurants! Don't miss out on " +
                "this EXCLUSIVE OFFER! from Beemathon App";



function send_sms() {
  axios
    .post(
      "https://apisms.beem.africa/v1/send",
      {
        source_addr: "INFO",
        schedule_time: "",
        encoding: 0,
        message: msgToSend,
        recipients: [
          {
            recipient_id: 1,
            dest_addr: "255653448900",
          },
          {
            recipient_id: 2,
            dest_addr: "255757838187",
          },
        ],
      },
      {
        headers: {
          "Content-Type": content_type,
          Authorization: "Basic " + btoa(api_key + ":" + secret_key),
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      }
    )
    .then((response) => console.log(response, api_key + ":" + secret_key))
    .catch((error) => console.error(error.response.data));
}

send_sms();
