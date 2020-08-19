// Enter here the user flows and custom policies for your B2C application
// To learn more about user flows, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview
// To learn more about custom policies, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview

const b2cPolicies = {
    names: {
        signUpSignIn: "b2c_1_susi",
        forgotPassword: "b2c_1_passwordreset",
        profileEdit: "b2c_1_profileedit"
    },
    authorities: {
        signUpSignIn: {
            authority: "https://cserecipe.b2clogin.com/cserecipe.onmicrosoft.com/b2c_1_susi",
        },
        forgotPassword: {
            authority: "https://cserecipe.b2clogin.com/cserecipe.onmicrosoft.com/b2c_1_passwordreset",
        },
        profileEdit: {
            authority: "https://cserecipe.b2clogin.com/cserecipe.onmicrosoft.com/b2c_1_profileddit",
        },
    },
}

export default b2cPolicies;