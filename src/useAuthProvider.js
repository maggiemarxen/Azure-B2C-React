import { useState, useEffect } from 'react';
import * as msal from 'msal';

// Enter here the user flows and custom policies for your B2C application
// To learn more about user flows, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview
// To learn more about custom policies, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview

const b2cPolicies = {
    names: {
        signUpSignIn: "b2c_1_susi",
        forgotPassword: "b2c_1_passwordreset",
    },
    authorities: {
        signUpSignIn: {
            authority: "https://cserecipe.b2clogin.com/cserecipe.onmicrosoft.com/b2c_1_susi",
        },
        forgotPassword: {
            authority: "https://cserecipe.b2clogin.com/cserecipe.onmicrosoft.com/b2c_1_passwordreset",
        },
    },
}

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
      /**
       * The cache location configures where your cache will be stored.
       * MSAL supports local storage (can span multiple sessions) or session storage (for a singular session).
       * https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-core/modules/_configuration_.html#cachelocation
       *  */
      cacheLocation: "localStorage",
      // Set the below to "true" to save cache in cookies to address trusted zones limitations in IE (see: https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/Known-issues-on-IE-and-Edge-Browser)
      storeAuthStateInCookie: false
    }
  };
  
  /** 
   * Scopes you enter here will be consented once you authenticate. For a full list of available authentication parameters, 
   * visit https://azuread.github.io/microsoft-authentication-library-for-js/docs/msal/modules/_authenticationparameters_.html
   * In our code sample, these scopes are for the identity token.  Identity tokens and access tokens may have different scopes,
   * and their scopes are set separately.
   */
  const loginRequest = {
    scopes: ["openid", "profile"],
  };

const msalApp = new msal.UserAgentApplication(msalConfig)

const useAuthProvider = () => {
    const [account, setAccount] = useState(null);

    const loginTypes = {
        popup: 'popup',
        redirect: 'redirect'
    }
/**
 * This is a catch-all for React lifecycle states. 
 */
    useEffect(() => {
        msalApp.handleRedirectCallback(async (error, loginResponse) => {
            if (error) {
                await handleLoginErrorAsync(error, loginTypes.redirect);
            } else {
                handleLoginSuccess(loginResponse);
            }
        });
        // eslint-disable-next-line
    }, []);

    const handleLoginErrorAsync = async (loginError, loginType) => {
        /**
         * In Azure AD B2C, when a user attempts to reset a password for a local account, we throw an error containing "AADB2C90118." For password reset
         * using our connected identity provideers, the user needs to reset his or her password through the integrated partner.
         *  */
        if (loginError.errorMessage.indexOf('AADB2C90118') > -1) {
            try {
                // Password reset policy/authority
                console.log('reset password requested');
                if (loginType === loginTypes.redirect) {
                    msalApp.loginRedirect(b2cPolicies.authorities.forgotPassword);
                } else if (loginType === loginTypes.popup) {
                    await msalApp.loginPopup(b2cPolicies.authorities.forgotPassword);
                }
            } catch (error) {
                loginError = error;
            }
        }

        console.error(`loginError: ${JSON.stringify(loginError)}`);
    }

    const handleLoginSuccess = (loginResponse) => {
        if (loginResponse != null &&
            loginResponse.tokenType === 'id_token' &&
            loginResponse.idToken?.issuer === process.env.REACT_APP_B2C_IDTOKEN_VALIDISSUER &&
            loginResponse.idToken?.claims?.aud === process.env.REACT_APP_B2C_APP_CLIENT_ID &&
            loginResponse.idToken?.claims?.tfp === process.env.REACT_APP_B2C_SUSI_POLICY_NAME) {
            console.log(`valid loginResponse: ${JSON.stringify(loginResponse)}`);
            let incomingAccount = msalApp.getAccount();
            setAccount(incomingAccount);
        } else {
            // Not a valid token, logout
            console.log('invalid loginResponse and/or id token, logging out!');
            msalApp.logout();
        }
    }

    const loginAsync = async (loginType) => {
        if (loginType === loginTypes.redirect) {
            console.log('acquiring token using redirect');
            msalApp.loginRedirect(loginRequest);
        } else if (loginType === loginTypes.popup) {
            console.log('acquiring token using popup');
            let loginResponse = await msalApp.loginPopup(loginRequest).catch(async (error) => {
                await handleLoginErrorAsync(error, loginTypes.popup);
            });
            handleLoginSuccess(loginResponse);
        }
    }

    const logoutAsync = async () => {
        msalApp.logout();
    }
/**
 * Scopes are set per access token, and are a way to manage permissions to protected resources. 
 * As an example, different scopes are needed for reaching different Microsoft Graph endpoints, such as accessing a calendar
 * as a user or sending an email as a user.
 * For more info on scopes please visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/access-tokens#scopes
 * @param {Access token scopes} scopes 
 */
    const getAccessTokenAsync = async (scopes) => {
        let request = loginRequest;
        request.scopes = scopes;
        /**
         * As of 8/26/20, MSAL integrated with Google forces an error within acquireTokenSilent, due to the multiple account selection
         * screen hitting a hidden iFrame.
         * There is a workaround by using acquireTokenRedirect or acquireTokenPopup, but these may appear to users as if they are logging in twice.
         * Disclaimer: This issue is planned to be resolved in the MSAL-2 (MSAL-browser) release. 
         */
        let response = await msalApp.acquireTokenSilent(request).catch(async (error) => {
            console.log(`unable to get access token for scopes: ${scopes}`);
            console.error(`login error: ${error}`);
        });

        return response.accessToken;
    }

    return {
        loginTypes, account, loginAsync, logoutAsync, getAccessTokenAsync
    };
}

export default useAuthProvider;