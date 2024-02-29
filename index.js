const express = require('express');

const app = express();

const ClientID = "vqaotm0lkq2jntsnzbj";
const ClientSecretKey = "p0566sjoypej99gjtaz";


app.get('/',(req,res) => {
    res.send("Hello There !");
});

app.listen(3000,()=>{
    console.log("server is running at http://localhost:3000")
})

const SmartsheetAuthUrl = "https://app.smartsheet.com/b/authorize";
const SmartsheetTokenUrl = "https://app.smartsheet.com/b/authorize";

app.get("/login", (req, res) => {
const redirectUrl = "http://localhost:3000/callback"
const authorizationUrl = SmartsheetAuthUrl;
    res.redirect(authorizationUrl);
  });

const config = {
    ACCESS_SCOPE : 'READ_USERS',
};

  const authorizationURL = authorizationUrl({
    client_id : ClientID,
    response_type : 'code',
    scope : config.ACCESS_SCOPE,
  });

