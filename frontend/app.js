// jshint esversion:8
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const bunyan = require('bunyan');
const config = require('./config');

const log = bunyan.createLogger({
  name: 'frontend-app.js',
});

// Route declarations
const route1Route = require('./routes/route1');

// -----------------------------------------------------------------------------
// Config the app, include middlewares
// -----------------------------------------------------------------------------
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Other middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: true,
}));

// Route assignments
app.use('/', route1Route);

//-----------------------------------------------------------------------------
// START APPLICATION
//-----------------------------------------------------------------------------
if (config.webApps.azureOrLocal === "azure") {
  app.listen(config.webApps.frontendSettings.azurePort, () => {
    log.info('Azure server started');
  });
} else {
  app.listen(config.webApps.frontendSettings.localPort, () => {
    log.info('Local server started');
  });
}