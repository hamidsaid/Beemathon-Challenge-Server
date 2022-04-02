const express = require('express')
const app = express()
const mongoClient = require('mongodb').MongoClient
const url = "mongodb://localhost:27017"
const axios = require("axios");
const https = require("https");
const btoa = require("btoa");

const content_type = "application/json";
const api_key = "";
const secret_key = "";
let sentPinId ="";


app.use(express.json())

mongoClient.connect(url, (err, db) => {

    if (err) {
        console.log("Error while connecting mongo client")
    } else {

         // creating/finding a Db
        const myDb = db.db('myDb')
        const collection = myDb.collection('myTable')




        app.post('/signup', (req, res) => {
            const newUser = {
                name: req.body.name,
                mobile: req.body.mobile,
                password: req.body.password
            }
           ///Check if user exists
            const query = { name: newUser.name }
                // Beem api code for requesting OTP code
                pin_request(newUser.mobile);

            collection.findOne(query, (err, result) => {
     

                if (result == null) {
                    collection.insertOne(newUser, (err, result) => {
                        res.status(200).send();
                    })
                } else {
                    res.status(400).send()
                }
            })
        })




        app.post('/login', (req, res) => {
            //check if user exist
            //define query
            const query = {
                mobile: req.body.mobile, 
                password: req.body.password
            }

            collection.findOne(query, (err, result) => {
                if (result != null) {
                    // Beem api code for requesting OTP code
                   pin_request(result.mobile);
     
                    const objToSend = {
                        name: result.name,
                        mobile: result.mobile
                    }
                    //specfying the status code and sending data to the android app
                    res.status(200).send(JSON.stringify(objToSend))

                } else {
                    res.status(404).send()
                }
            })
        })




        app.post("/verify" , function(req , res) {
            const userPinCode = req.body.pinCode;

            axios
            .post(
              "https://apiotp.beem.africa/v1/verify",
              {
                pinId: sentPinId,
                pin: userPinCode,
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
            .then((response) => {
                 console.log("success", response);
                 successfulVerifiedCode = 200;
                  //sending back a status code to allow the user to proceed
                if(successfulVerifiedCode == 200){
                    res.status(200).send();
                } else{
                    res.status(404).send()
                }
                 
      
          })
            .catch((error) => console.error(error));

        })



        


    }

})

app.listen(3000, () => {
    console.log("Listening on port 3000...")
})



function pin_request(mobile) {
    axios
      .post(
        "https://apiotp.beem.africa/v1/request",
        {
          appId: 195,
          msisdn: mobile,
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
      .then((response) =>{
      
       console.log("success", response.data)
       //taking the sent pinId for verification
       sentPinId =  response.data.data.pinId;

      }).catch((error) =>{
          console.log("ERROR");
          console.error(error);
      });
  }



  

