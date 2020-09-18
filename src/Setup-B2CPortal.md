Azure AD B2C Setup

Welcome to our sample!

1. Identity Providers

We chose the identity providers X.  This is a sample selection of some possibilities, but feel free to refer to X for more examples.

These identity providers are all availble using OpenId Connect, but, using Custom Policy, more providers can be added. 

https://docs.microsoft.com/en-us/azure/active-directory-b2c/tutorial-add-identity-providers#add-the-identity-providers

2. User Flows

Our chosen user flows are Sign Up Sign In, and Forgot Password/Password Reset.

For Sign Up Sign In, we chose the user policy name "B2C_1_susi"-- this naming pattern is arbitrary, and can be found in this codebase by doing a search for this name, but must match its name in the Azure Portal.

For Forgot Password/Password reset, we chose the user policy name "B2C_1_passwordreset" and the same naming convention applies.

For more info on user flows, please visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/tutorial-create-user-flows

3. Application Registration

Application Registration takes place within the online Azure Portal.

https://docs.microsoft.com/en-us/azure/active-directory-b2c/tutorial-create-tenant
https://docs.microsoft.com/en-us/azure/active-directory-b2c/tutorial-register-applications?tabs=app-reg-ga
