import { useState, useEffect } from 'react';
import b2cPolicies from './policies';
import * as msal from 'msal';
import { msalConfig, loginRequest } from './authConfig';

const msalApp = new msal.UserAgentApplication(msalConfig)

const useAuthProvider = () => {
    const [account, setAccount] = useState(null);
    const [idToken, setIdToken] = useState(null);

    const loginTypes = {
        popup: 'popup',
        redirect: 'redirect'
    }

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
            setIdToken(loginResponse.idToken.rawIdToken);
        } else {
            // Not a valid token, logout
            console.log('invalid loginResponse and/or id token, logging out!');
            msalApp.logout();
        }
    }

    const doLoginAsync = async (loginType) => {
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

    const loginAsync = async (loginType) => {
        if (account) {
            // account, try and grab a token
            loginRequest.loginHint = account.emailAddresses[0];
            return await msalApp.acquireTokenSilent(loginRequest).catch(async (error) => {
                console.log('silent token acquisition fails.');
                console.error(`login error: ${error}`);
                // maybe the token expired, retry
                await doLoginAsync(loginType);
            });
        } else {
            // no account, login            
            await doLoginAsync(loginType);
        }
    }

    const logoutAsync = async () => {
        msalApp.logout();
    }

    const getAccessTokenAsync = async (scopes) => {
        let request = loginRequest;
        request.scopes = scopes;
        let response = await msalApp.acquireTokenSilent(request).catch(async (error) => {
            console.log(`unable to get access token for scopes: ${scopes}`);
            console.error(`login error: ${error}`);
        });

        return response.accessToken;
    }

    return {
        loginTypes, account, idToken, loginAsync, logoutAsync, getAccessTokenAsync
    };

}

export default useAuthProvider;