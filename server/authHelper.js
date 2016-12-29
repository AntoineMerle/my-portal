var credentials = {
  client: {
    id: 'c0fb55a2-9d75-4574-90d2-12c0b2e76178',
    secret: '3yx0UV74FtqvajWCjDkMk7D',
  },
  auth: {
    tokenHost: 'https://login.microsoftonline.com',
    authorizePath: 'common/oauth2/v2.0/authorize',
    tokenPath: 'common/oauth2/v2.0/token'
  }
};
var oauth2 = require('simple-oauth2').create(credentials);

var redirectUri = 'http://localhost:8001/authorize';

// The scopes the app requires
// The scopes the app requires
var scopes = [ 'openid',
              'offline_access',
              'https://outlook.office.com/mail.read',
              'https://outlook.office.com/calendars.read' ];

function getAuthUrl() {
  var returnVal = oauth2.authorizationCode.authorizeURL({
    redirect_uri: redirectUri,
    scope: scopes.join(' ')
  });
  console.log('Generated auth url: ' + returnVal);
  return returnVal;
}

function getTokenFromCode(auth_code, callback, response) {
  var token;
  console.log("Auth_code: "+auth_code);
  oauth2.authorizationCode.getToken({
    code: auth_code,
    redirect_uri: redirectUri,
    scope: scopes.join(' ')
  }, function (error, result) {
    if (error) {
      console.log('Access token error: ', error.message);
      callback(response, error, null);
    } else {
      token = oauth2.accessToken.create(result);
      console.log('Token created: ', token.token);
      callback(response, null, token);
    }
  });
}

function refreshAccessToken(refreshToken, callback) {
  var tokenObj = oauth2.accessToken.create({refresh_token: refreshToken});
  tokenObj.refresh(callback);
}

exports.refreshAccessToken = refreshAccessToken;
exports.getAuthUrl = getAuthUrl;
exports.getTokenFromCode = getTokenFromCode;
