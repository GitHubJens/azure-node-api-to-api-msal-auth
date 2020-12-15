const msal = require('@azure/msal-node');
exports.webApps = {
    azureOrLocal: "azure", // Change this to "local" if you want to test on your laptop instead of Azure
    api2Settings: {
        localPort: 3002,
        localUrl: 'localhost:3002',
        azurePort: 8080,
        azureUrl: '<App Service API2 Name>.azurewebsites.net', // Update this
        path: 'get',
    },
    api1Settings: {
        localPort: 3001,
        localUrl: 'localhost:3001',
        azurePort: 8080,
        azureUrl: '<App Service API1 Name>.azurewebsites.net', // Update this
        path: 'get',
        msalConfig: {
            auth: {
                clientId: "<Your Azure AD Application ID>", // Update this
                authority: "https://login.microsoftonline.com/<Your Tenant ID>", // Update this
                clientSecret: "<Your Azure AD Application Secret>", // Update this
            },
            system: {
                loggerOptions: {
                    loggerCallback(loglevel, message, containsPii) {
                        console.log(message);
                    },
                    piiLoggingEnabled: false,
                    logLevel: msal.LogLevel.Verbose,
                },
            }
        },
    },
    frontendSettings: {
        localPort: 3000,
        localUrl: 'localhost:3000',
        azureUrl: '<App Service Frontend Name>.azurewebsites.net', // Update this
        azurePort: 8080,
    },
};