// jshint esversion:8
const bunyan = require('bunyan');

const log = bunyan.createLogger({
  name: 'httpRequestHelper.js',
});

const https = require('https');

// Normal https request wrapper for inbuilt https support in js
exports.doHttpRequest = async function doHttpRequest(options) {
  return new Promise((resolve) => {
    let str = '';
    const req = https.request(options, (res) => {
      res.on('data', (chunk) => {
        str += chunk;
      });

      res.on('end', () => {
        // Return result
        if (res.statusCode > 399) {
          log.error(`${options.method} | Port: ${options.port} | Hostname: ${options.hostname} | Path: ${options.path} | Status Code: ${res.statusCode} | Message: ${res.statusMessage} | Error: ${str}`);
        } else {
          log.info(`${options.method} | Port: ${options.port} | Hostname: ${options.hostname} | Path: ${options.path} | Status Code: ${res.statusCode} | Message: ${res.statusMessage}`);
        }
        resolve(str);
      });
    });

    req.on('error', (error) => {
      log.error(`${options.method} | Port: ${options.port} | Hostname: ${options.hostname} | Path: ${options.path} | Error: ${error}`);
    });

    req.end();
  });
};

// Normal https request wrapper for inbuilt https support in js
exports.doHttpPostRequest = async function doHttpPostRequest(options, postData) {
  return new Promise((resolve) => {
    let str = '';
    const req = https.request(options, (res) => {
      res.on('data', (chunk) => {
        str += chunk;
      });

      res.on('end', () => {
        // Return result
        if (res.statusCode > 399) {
          log.error(`${options.method} | Port: ${options.port} | Hostname: ${options.hostname} | Path: ${options.path} | Status Code: ${res.statusCode} | Message: ${res.statusMessage} | Error: ${str}`);
        } else {
          log.info(`${options.method} | Port: ${options.port} | Hostname: ${options.hostname} | Path: ${options.path} | Status Code: ${res.statusCode} | Message: ${res.statusMessage}`);
        }
        resolve(str);
      });
    });

    req.on('error', (error) => {
      log.error(`${options.method} | Port: ${options.port} | Hostname: ${options.hostname} | Path: ${options.path} | Error: ${error}`);
    });

    req.write(postData);
    req.end();
  });
};
