
require('dotenv').config();
const express = require('express');
const OAuthClient = require('intuit-oauth');


const app = express();
const port = 3000;


const oauthClient = new OAuthClient({
    clientId: process.env.CLIENT_ID, 
    clientSecret: process.env.CLIENT_SECRET, 
    environment: process.env.ENVIRONMENT, 
    redirectUri: process.env.REDIRECT_URL 
});





app.get('/auth', (req, res) => {
   
    const authUri = oauthClient.authorizeUri({
        scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId],
        state: 'testState' 
    });
    
    res.redirect(authUri);
});








app.get('/callback', async (req, res) => {
    const parseRedirect = req.url;
    const { code, realmId } = req.query;

    try {
  
        const authResponse = await oauthClient.createToken(parseRedirect);
       


       

 
        console.log(authResponse)

       

       


     
        res.redirect('/invoices');
    } catch (e) {
        console.error('Error', e);
    }
});







app.get('/invoices', async (req, res) => {
    try {
   
        const response = await oauthClient.makeApiCall({
            url: `https://sandbox-quickbooks.api.intuit.com/v3/company/9341453270638841/query?query=select * from Invoice&minorversion=40`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
      
        res.json(response.body);
    } catch (e) {
        console.error(e);
    }
});


app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});





// refresh_token: 'AB11737574466ScvpewXaqlJcoNkb9amwdPT4kmzL9pUuNryEi',