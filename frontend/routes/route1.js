// jshint esversion:8
const express = require('express');
const bunyan = require('bunyan');
const config = require('../config');
const axios = require('axios');

const log = bunyan.createLogger({
  name: 'start',
});

const router = express.Router();

// get route for route1view
router.get('/', async (req, res) => {
  res.render('route1view');
});

// get route for get
router.get('/get', async (req, res) => {
  let hostname = "";
  let httpOrHttps = "";
  if (config.webApps.azureOrLocal === "azure") {
    hostname = config.webApps.api1Settings.azureUrl;
    httpOrHttps = "https";
  } else {
    hostname = config.webApps.api1Settings.localUrl;
    httpOrHttps = "http";
  }
  const path = config.webApps.api1Settings.path;
  axios.get(`${httpOrHttps}://${hostname}/${path}`)
    .then(function (response) {
      log.info(`Success: ${response.data}`);
      res.render('route1view', { result: response.data });
    })
    .catch(function (error) {
      log.error(`frontend /get-route axios request failed with \"${error}\"`);
      res.render('route1view', { result: error });
    })
});

module.exports = router;