const { CognitoJwtVerifier } = require("aws-jwt-verify");
const COGNITO_USERPOOL_ID = process.env.COGNITO_USERPOOL_ID;
const COGNITO_WEB_CLIENT_ID = process.env.COGNITO_WEB_CLIENT_ID;


const jwtVerifier = CognitoJwtVerifier.create({
    userPoolId: COGNITO_USERPOOL_ID,
    tokenUse: "id",
    clientId: COGNITO_WEB_CLIENT_ID
})
const generatePolicy = (principalId, effect, resource) => {
    const authResponse = {};
    authResponse.principalId = principalId;

    if (effect && resource) {
        let policyDocument = {
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: effect,
                    Resource: resource,
                    Action: "execute-api:Invoke",
                },
            ],
        };
        authResponse.policyDocument = policyDocument
    }
    authResponse.context = {
        foo: 'bar'
    }
    console.log(JSON.stringify(authResponse));
    return authResponse;
}

exports.handler = async (event, context, cb) => {
    let token = event.authorizationToken;
    console.log(token);
    try {
        const payload = await jwtVerifier.verify(token);
        console.log(JSON.stringify(payload));
        cb(null, generatePolicy('user', 'Allow', event.methodArn));
    } catch (e) {
        cb("Error: Invalid token");
    }
}

//https://mynotescd-dev.auth.eu-west-2.amazoncognito.com/login?response_type=token&client_id=16bks14c6o5k5h7rsqd9iosp5b&redirect_uri=http://localhost:3000

// https://mynotescd-temp.auth.eu-west-2.amazoncognito.com/login?response_type=token&client_id=1htjoqgq4p20afqmn0qm4eo24l&redirect_uri=http://localhost:3000

// #id_token=eyJraWQiOiJKQlMxQktSWjl4VFI5UERMdzNyWWRpM2xwaUdRcDFMODVGcld6Z2lTUnJnPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiWmwtdkZFd3MtYVpOUWlsbnM4Vy1sZyIsInN1YiI6IjY3ZTFlYmQ1LTk2MmQtNDkzNy1iOTc0LTgyOWVkMDA1YTk0OSIsImF1ZCI6IjFodGpvcWdxNHAyMGFmcW1uMHFtNGVvMjRsIiwiZXZlbnRfaWQiOiIyOTkwNDRiMy0yZGZhLTRmMTItYmJiNi1kM2Q0YzRkYTdiMDEiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY3MzIxOTQ0NywiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LXdlc3QtMi5hbWF6b25hd3MuY29tXC9ldS13ZXN0LTJfSEFpRHN0UFZDIiwiY29nbml0bzp1c2VybmFtZSI6InR1ZG9zbSIsImV4cCI6MTY3MzIyMzA0NywiaWF0IjoxNjczMjE5NDQ3LCJqdGkiOiJjNzdjYmM5OS0xZDI1LTQwYzAtYWFlMS03MGVjZTc2MjVlYjgifQ.hXydSJt4MSkq3zls_8tVOobHssAI2-zwuSsh39WPdzl6zoN9_rAFAaebR65tZ4Lrq1T6pNR4zSOY_K9LDrtxzyyzT7XKElOTagq4UWCEfJpnaOCxNB7LIQz9jqAeQjH0kawsYitt8N10g_C88utdHgWR-lTrbHrk_Jho9F349KV9sND47xDhrd-BbAdGfHunudISL5ZsHjxRwpchwy_g0GMc3BTdT-zqyv7YdkMWd_4hbb9w2e0tSKmpbW2N2T-F92LjO9Nks8tGNT2v_0ch6bwiOAPtui-4yXqEbPklu7bleYehrLd_rOzp_5Yns_pc32VCy_HTKD32zbHVaI7GAg
// &access_token=eyJraWQiOiI3c3Z1aFwvS0dodmRsT2t6bnhGV1RSR2xoSk5iNURVbFM3MXRLU2JvNFJ3OD0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI2N2UxZWJkNS05NjJkLTQ5MzctYjk3NC04MjllZDAwNWE5NDkiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0yLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMl9IQWlEc3RQVkMiLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiIxaHRqb3FncTRwMjBhZnFtbjBxbTRlbzI0bCIsImV2ZW50X2lkIjoiMjk5MDQ0YjMtMmRmYS00ZjEyLWJiYjYtZDNkNGM0ZGE3YjAxIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJwaG9uZSBvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImF1dGhfdGltZSI6MTY3MzIxOTQ0NywiZXhwIjoxNjczMjIzMDQ3LCJpYXQiOjE2NzMyMTk0NDcsImp0aSI6IjNlNDYxYzZkLTkwY2UtNGQ4YS1iMWVlLTU0MzExOTRmNjY2NyIsInVzZXJuYW1lIjoidHVkb3NtIn0.Mib6TH6melANhBfMS_XeIqi0ob8d7GK6dL-JIqJL-9qlBzSIPrYHS0x47v9Bh2IqN6e6dpaMMT8aLzFzV5PJRhI6Uowgq3kncwQCL6lsFeYYA65jRmmYR290LZYVdSSvg1Ytr1bVRXm7on7gKLJl5NHc32g6r9E2wGiK7jQqobljENe0nj82KrCmXLZRdgUo8D1_xFdfpq3kkwNCiWVK900qHXVSGzk7ez0g88G0g_rnhrL6RSvAEd7kzmbWVUI5wrk6KmugF5N-Ba-1qSLDzPzJP7ONAc3qCJgxKn0vl_-Gjo9PZGjBG4rM0AvCQuiydTCkwg4-EfvYOrcKllR1UQ&expires_in=3600&token_type=Bearer