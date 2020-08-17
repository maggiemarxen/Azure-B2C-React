// Update these four variables with values from your B2C tenant in the Azure portal
const clientID = "8be9bf20-fb79-49f3-afed-b680c97fe795"; // Application (client) ID of your API's application registration
const b2cDomainHost = "cserecipe.b2clogin.com";
const tenantId = "cserecipe.onmicrosoft.com"; // Alternatively, you can use your Directory (tenant) ID (a GUID)
const policyName = "b2c_1_susi";

const config = {
    identityMetadata: "https://" + b2cDomainHost + "/" + tenantId + "/" + policyName + "/v2.0/.well-known/openid-configuration/",
    clientID: clientID,
    policyName: policyName,
    isB2C: true,
    validateIssuer: false,
    loggingLevel: 'info',
    loggingNoPII: false,
    passReqToCallback: false
}

module.exports = config;