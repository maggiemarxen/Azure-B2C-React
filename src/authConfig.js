import b2cPolicies from './policies';

/**
 * Config object to be passed to MSAL on creation.
 * For a full list of msal.js configuration parameters, 
 * visit https://azuread.github.io/microsoft-authentication-library-for-js/docs/msal/modules/_configuration_.html
 * */
const msalConfig = {
    auth: {
      clientId: process.env.REACT_APP_B2C_APP_CLIENT_ID,
      authority: b2cPolicies.authorities.signUpSignIn.authority,
      redirectUri: process.env.REACT_APP_B2C_APP_REDIRECT_URL,
      validateAuthority: false
    },
    cache: {
      cacheLocation: "localStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false // Set this to "true" to save cache in cookies to address trusted zones limitations in IE (see: https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/Known-issues-on-IE-and-Edge-Browser)
    }
  };
  
  /** 
   * Scopes you enter here will be consented once you authenticate. For a full list of available authentication parameters, 
   * visit https://azuread.github.io/microsoft-authentication-library-for-js/docs/msal/modules/_authenticationparameters_.html
   */
  const loginRequest = {
    scopes: ["openid", "profile"],
  };

  export { msalConfig, loginRequest }