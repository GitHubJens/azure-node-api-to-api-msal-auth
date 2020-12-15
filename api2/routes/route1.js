// jshint esversion:8
const express = require('express');
const bunyan = require('bunyan');

const log = bunyan.createLogger({
  name: 'route1.js',
});

const router = express.Router();

/* Decodes token and returns the decoded object
Example token: "Bearer eyJ0eXAiOiJKV1QiLCJhbGci..." */
function decodeToken(token) {
  const tokenString = token.split(" ")[1] // Removed Bearer from the token string
  const base64Url = tokenString.split('.')[1];
  const decodedToken = Buffer.from(base64Url, 'base64').toString();
  return JSON.parse(decodedToken);
}

function hasRole(role) {
  return function (req, res, next) {
    if (req.hasOwnProperty("headers")) {
      if (req.headers.hasOwnProperty("authorization")) {
        const decodedToken = decodeToken(req.headers.authorization);
        if (decodedToken.hasOwnProperty("roles")) {
          if (decodedToken.roles.includes(role)) {
            log.info(`Token contains the correct role \"${role}\" and is authorized to access data!`)
            return next();
          }
        }
      }
    }
    res.status(401).send("Unauthorized");
  }
};

// get route that also makes sure caller is authorized
router.get('/get', [hasRole("can_call_api")], async (req, res) => {
  log.info('Sending data :)');
  res.status(200).send(`Hello from API2`);
});

module.exports = router;