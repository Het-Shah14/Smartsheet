const express = require('express');
const qs = require('querystring');
const axios = require('axios');
const crypto = require('crypto');

const authURL = 'https://app.smartsheet.com/b/authorize';
const clientId = 'vqaotm0lkq2jntsnzbj';
const redirectUri = 'http://localhost:3000/callback';
const scope = 'READ_USERS';
const appSecret = 'p0566sjoypej99gjtaz';
const app = express();



app.get('/',(req,res) => {
    res.send("Hello There !");
});



const config = {
  ACCESS_SCOPE : scope,
  ClientID : clientId,
  Redirect_uri: redirectUri,
  APP_SECRET: appSecret,
  
};

const authorizeURL = `${authURL}?${qs.stringify(config)}`;

// const SmartsheetAuthUrl = "https://app.smartsheet.com/b/authorize";
// const SmartsheetTokenUrl = "https://app.smartsheet.com/b/authorize";

// app.get("/login", (req, res) => {
// const redirectUrl = "http://localhost:3000/callback"
// const authorizationUrl = SmartsheetAuthUrl;
//     res.redirect(authorizationUrl);
//   });

 

app.get("/callback", (req,res) =>{
  
   
  const  code  = req.query.code;
  console.log("code :" ,code);
  const hashcode = require('crypto')
  .createHash('sha256')
  .update(config.APP_SECRET + '|' + hashcode)
  .digest('hex');

  const tokenResponse =  axios.post('https://api.smartsheet.com/2.0/token', null, {
    params: {
      client_id: clientId,
      redirect_Uri: redirectUri,
      hash: hashcode,
      grant_type: 'authorization_code',
    },
})

try{
  const accessToken = tokenResponse.data.access_token;
  res.send('Authentication successful!');
}
   catch (error) {
    console.error('Error handling callback:', error.message);
    res.status(500).send('Error handling callback');
  }
   
});



app.listen(3000,()=>{
  console.log("server is running at http://localhost:3000")
})