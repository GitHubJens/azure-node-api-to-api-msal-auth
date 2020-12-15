// jshint esversion:8
const express = require('express');
const bunyan = require('bunyan');
const config = require('../config');
const axios = require('axios');
const msal = require('@azure/msal-node');

const log = bunyan.createLogger({
  name: 'route1.js',
});

const router = express.Router();

// Create msal application object
const cca = new msal.ConfidentialClientApplication(config.webApps.api1Settings.msalConfig);

// get route
router.get('/get', async (req, res) => {
  const clientCredentialRequest = {
    scopes: config.webApps.api1Settings.scopes,
  };

  // Get token with client authentication using the application
  cca.acquireTokenByClientCredential(clientCredentialRequest).then((response) => {
    log.info(`Response: ${JSON.stringify(response)}`);
    // Rest call to next API using the token
    let hostname = "";
    let httpOrHttps = "";
    if (config.webApps.azureOrLocal === "azure") {
      hostname = config.webApps.api2Settings.azureUrl;
      httpOrHttps = "https";
    } else {
      hostname = config.webApps.api2Settings.localUrl;
      httpOrHttps = "http";
    }
    const path = config.webApps.api2Settings.path;
    const getConfig = { headers: { Authorization: `${response.tokenType} ${response.accessToken}` } }
    axios.get(`${httpOrHttps}://${hostname}/${path}`, getConfig)
      .then(function (response) {
          log.info(`Success: ${response.data}`);
          res.status(response.status).send(response.data);
      })
      .catch(function (error) {
        if (error.response) {
          log.error(`api1 /get-route axios request failed with \"${error}\"`);
          res.status(error.response.status).send(error);
        }
      })
  }).catch((error) => {
    log.error(JSON.stringify(error));
  });
});

module.exports = router;