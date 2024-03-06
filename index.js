// const express = require('express');
// const qs = require('querystring');
// const axios = require('axios');
// const crypto = require('crypto');

// const authURL = 'https://app.smartsheet.com/b/authorize';
// const clientId = 'vqaotm0lkq2jntsnzbj';
// const redirectUri = 'http://localhost:3000/callback';
// const scope = 'READ_USERS';
// const appSecret = 'p0566sjoypej99gjtaz';
// const app = express();



// app.get('/',(req,res) => {
//     res.send("Hello There !");
// });



// const config = {
//   ACCESS_SCOPE : scope,
//   ClientID : clientId,
//   Redirect_uri: redirectUri,
//   APP_SECRET: appSecret,
  
// };

// const authorizeURL = `${authURL}?${qs.stringify(config)}`;

// // const SmartsheetAuthUrl = "https://app.smartsheet.com/b/authorize";
// // const SmartsheetTokenUrl = "https://app.smartsheet.com/b/authorize";

// // app.get("/login", (req, res) => {
// // const redirectUrl = "http://localhost:3000/callback"
// // const authorizationUrl = SmartsheetAuthUrl;
// //     res.redirect(authorizationUrl);
// //   });

 

// app.get("/callback", (req,res) =>{
  
   
//   const  code  = req.query.code;
//   console.log("code :" ,code);
//   const hashcode = require('crypto')
//   .createHash('sha256')
//   .update(config.APP_SECRET + '|' + hashcode)
//   .digest('hex');

//   const tokenResponse =  axios.post('https://api.smartsheet.com/2.0/token', null, {
//     params: {
//       client_id: clientId,
//       redirect_Uri: redirectUri,
//       hash: hashcode,
//       grant_type: 'authorization_code',
//     },
// })

// try{
//   const accessToken = tokenResponse.data.access_token;
//   res.send('Authentication successful!');
// }
//    catch (error) {
//     console.error('Error handling callback:', error.message);
//     res.status(500).send('Error handling callback');
//   }
   
// });



// app.listen(3000,()=>{
//   console.log("server is running at http://localhost:3000")
// })

const express = require('express');
const qs = require('querystring');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
const port = 3000;

const config = {
  APP_CLIENT_ID: 'ltacmvm2rp0ls9ivzj6',
  APP_SECRET: '1my68hx63kw6xhbpy29',
  REDIRECT_URI: 'http://localhost:3000/callback',
  SCOPE: 'READ_USERS',
  ENDPOINT: 'https://api.smartsheet.com/2.0/users/me',
};

app.get('/login', (req, res) => {
  const authURL = 'https://app.smartsheet.com/b/authorize';

  const authParams = {
    response_type: 'code',
    client_id: config.APP_CLIENT_ID,
    redirect_uri: config.REDIRECT_URI,
    scope: config.SCOPE,
  };

  const authorizationURL = `${authURL}?${qs.stringify(authParams)}`;
  res.redirect(authorizationURL);
});

app.get('/callback', async (req, res) => {
  try {
    const authCode = req.query.code;

    // Generate hash for security verification
    const generatedHash = crypto
      .createHash('sha256')
      .update(config.APP_SECRET + "|" + authCode)
      .digest('hex');
    console.log({authCode, generatedHash})
    // Exchange authorization code for access token
    const tokenResponse = await axios.post('https://api.smartsheet.com/2.0/token', null, {
      params: {
        client_id: config.APP_CLIENT_ID,
        code: authCode,
        hash: generatedHash,
        grant_type: 'authorization_code',
        scope: config.SCOPE,
      },
      // headers: {
      //   'Content-Type': 'application/x-www-form-urlencoded', // Specify the content type
      // },
    });
    console.log({tokenResponse})

    //http://localhost:3000/callback?code=d1ijv7lczvrgk9w0&expires_in=599097&state=

    // Access token is in tokenResponse.data.access_token
    const accessToken = tokenResponse.data.access_token;
    console.log('Access Token:', accessToken);
    // Use the access token to make API requests to Smartsheet
    const userDetails = await getAllUsers(accessToken);

    console.log('Token Request:', tokenResponse.config);
    console.log("userDetails:", userDetails);
    console.log('Token Response:', tokenResponse.data);

    // Respond with user details
    res.json(userDetails);
  } catch (error) {
    console.error('Error handling callback:', error.message);
    res.status(500).send('Error handling callback');
  }
});

async function getAllUsers(accessToken) {
  try {
    const response = await axios.get(config.ENDPOINT,{
      headers: {
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    

    // Process the user data as needed
    const userInfo = response.data;
    console.log('Authenticated user info:', userInfo);

    // Now you can use this userInfo to create a new user or perform other actions

    return userInfo;

    
  } catch (error) {
    console.error('Error fetching users:', error.message);
    console.error('Error fetching users:', error.response.data);
    throw error; // Rethrow the error to be handled in the calling function
  }
}


app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

