## Introduction
Example of creating a micro service application with a frontend calling an API which in its turn authenticate using the with Azure AD and then uses the token to call another protected API.

![](/documentation/images/architecture.png)

This solution uses the supported case "Web APIs that call web APIs" from the msal-node library and uses the "Client Credentials" flow to get a token with the appropriate access rights.
* This guide is able to show you how you integrate it into your application: https://www.npmjs.com/package/@azure/msal-node#about
* This is the example from the link above: https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples/msal-node-samples/standalone-samples/client-credentials

## Prerequisites
### Creating the two Azure Applications used by the API applications
1. Create API1 from Azure AD → App registrations → New registration
1. Give it a name, like for example "msapi1"
1. Select the version for "Accounts in this organizational directory only (YourTenantName - Single tenant)"
1. Do the same procedure for API2 and call it "msapi2"

### Creating a secret for API1
When an application need to ask for tokens without any human intervention it needs a secret that can be used in the "Client Credential"-flow. API1 will be asking for tokens to access API2, so we need to create a secret for API1.

1. Azure AD → Find application for API1 → "Certificates and secrets" → "New client secret"
![](/documentation/images/new-client-secret.png)

### Setting up roles and permissions
API1 must be authorized to request a token that can call the protected route on API2.
1. Make sure that API2 has an established route, otherwise create one
![](/documentation/images/api2-app-route.png)

2. Create a new app role on API2
![](/documentation/images/new-app-role-api2.png)

3. Give API1 access to request tokens containing the new role
![](/documentation/images/ap1-request-access.png)

4. Fulfill the admin consent for the API permission. You need to do this as the access lies under "Application permissions" which means that the application can request tokens and refresh tokens by itself and therefore without any user input
![](/documentation/images/fulfill-admin-consent.png)

5. Remove the excessive access given by the command
![](/documentation/images/remove-excessive-access.png)

### Update the config for the services
Update the config which is present in all micro services

![](/documentation/images/update-config.png)

### Deploy solution to Azure
1. Deploy every service as an App Service for Linux to Azure using the extension to Visual Studio Code

![](/documentation/images/deploy-to-azure/deploy1.png)

![](/documentation/images/deploy-to-azure/deploy2.png)

![](/documentation/images/deploy-to-azure/deploy3.png)

![](/documentation/images/deploy-to-azure/deploy4.png)

![](/documentation/images/deploy-to-azure/deploy5.png)

![](/documentation/images/deploy-to-azure/deploy6.png)

![](/documentation/images/deploy-to-azure/deploy7.png)

![](/documentation/images/deploy-to-azure/deploy8.png)

![](/documentation/images/deploy-to-azure/deploy9.png)

![](/documentation/images/deploy-to-azure/deploy10.png)

![](/documentation/images/deploy-to-azure/deploy11.png)

![](/documentation/images/deploy-to-azure/deploy12.png)

![](/documentation/images/deploy-to-azure/deploy13.png)


## Overview of the micro service code
### Frontend
Contains two routes "/" and "/get" where the "/get" route sends a get request to API1 using axios package and then waits for API1 to return data.

### API1
API1 receives a request from the frontend axios get call and then uses the "@azure/msal-node" package to get a token for the "api://msapi2/.default" scope. When it has a token it in its turn does a get request using axios to API2 when the access token in its "authorization" header.

### API2
API2 gets the request from API1 and immediately decode the token looking at the "roles" in the claims. Is the request contains the "can_call_api"-role it will accept the request and return the data to API1 which in its turn return it to the frontend that presents it on the screen.