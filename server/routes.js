//pour outlook
var authHelper = require('./authHelper'); //module d'authentifcation pour outlook
var outlook = require('node-outlook'); // module outlook
var url = require('url');
var port = process.env.PORT || 8001; //définition du port sur lequel on va écouter

//Export des modules
module.exports = {

  home: function(req, res) {
    console.log('Request handler \'home\' was called.');
    res.send('<div id="root"><p>Please <a href="' + authHelper.getAuthUrl() + '">sign in</a> with your Office 365 or Outlook.com account.</p></div>');
  },

  mail : function(req,res){

      getAccessToken(req, res, function(error, token) {
        console.log('Token found in cookie: ', token);
        var email = getValueFromCookie('node-tutorial-email', req.headers.cookie);
        console.log('Email found in cookie: ', email);
        if (token) {
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.write('<div><h1>Your inbox</h1></div>');

          var queryParams = {
            '$select': 'Subject,ReceivedDateTime,From,IsRead',
            '$orderby': 'ReceivedDateTime desc',
            '$top': 10
          };

          // Set the API endpoint to use the v2.0 endpoint
          outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0');
          // Set the anchor mailbox to the user's SMTP address
          outlook.base.setAnchorMailbox(email);

          outlook.mail.getMessages({token: token, odataParams: queryParams},
            function(error, result){
              if (error) {
                console.log('getMessages returned an error: ' + error);
                res.write('<p>ERROR: ' + error + '</p>');
                res.end();
              } else if (result) {

                ///////////AFFICHAGE DU TABLEAU Des MAILS//////////////////////////////////////////////
                console.log('getMessages returned ' + result.value.length + ' messages.');
                res.write('<table><tr><th>From</th><th>Subject</th><th>Received</th></tr>');
                result.value.forEach(function(message) {
                  console.log('  Subject: ' + message.Subject);
                  var from = message.From ? message.From.EmailAddress.Name : 'NONE';
                  res.write('<tr><td>' + from +
                    '</td><td>' + (message.IsRead ? '' : '<b>') + message.Subject + (message.IsRead ? '' : '</b>') +
                    '</td><td>' + message.ReceivedDateTime.toString() + '</td></tr>');
                });
                res.write('</table>');
                /////////////////////////////////////////////////////////////////////////////////////////
                res.end();
              }
            });
        } else {
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.write('<p> No token found in cookie!</p>');
          res.end();
        }
      });
  },

  calendar : function(req, res){
    getAccessToken(req, res, function(error, token) {
      console.log('Token found in cookie: ', token);
      var email = getValueFromCookie('node-tutorial-email', req.headers.cookie);
      console.log('Email found in cookie: ', email);
      if (token) {
      var queryParams = {
        '$select': 'Subject,Start,End',
        '$orderby': 'Start/DateTime desc',
        '$top': 10
      };
  // Set the API endpoint to use the v2.0 endpoint
  outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0');
  // Set the anchor mailbox to the user's SMTP address
  outlook.base.setAnchorMailbox(email);
  // Set the preferred time zone.
  // The API will return event date/times in this time zone.
  outlook.base.setPreferredTimeZone('Eastern Standard Time');

  outlook.calendar.getEvents({token: token, odataParams: queryParams},
    function(error, result){
      if (error) {
        console.log('getEvents returned an error: ' + error);
      } else if (result) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({result}, null, 3));
        /*
      console.log("MES RESULTATS");
        console.log(result);
        console.log('getEvents returned ' + result.value.length + ' events.');
        res.write('<table><tr><th>Subject</th><th>Start</th><th>End</th></tr>');
        result.value.forEach(function(event) {
        console.log('  Subject: ' + event.Subject);
        res.write('<tr><td>' + event.Subject +
          '</td><td>' + event.Start.DateTime.toString() +
          '</td><td>' + event.End.DateTime.toString() + '</td></tr>');
        });
        res.write('</table>');
        res.end();*/
      }
    });
      } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<p> No token found in cookie!</p>');
        res.end();
      }
    });
  },

  authorize: function(req, res) {
    console.log('Request handler \'authorize\' was called.');

    // The authorization code is passed as a query parameter
    var url_parts = url.parse(req.url, true);
    var code = url_parts.query.code;
    console.log('Code: ' + code);
    authHelper.getTokenFromCode(code, tokenReceived, res);
  }

}



//Fonction qui récupére le mail du user
function getUserEmail(token, callback) {
  // Set the API endpoint to use the v2.0 endpoint
  outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0');

  // Set up oData parameters
  var queryParams = {
    '$select': 'DisplayName, EmailAddress',
  };

  outlook.base.getUser({token: token, odataParams: queryParams}, function(error, user){
    if (error) {
      callback(error, null);
    } else {
      callback(null, user.EmailAddress);
    }
  });
}

//reception du token
function tokenReceived(res, error, token) {
  if (error) {
    console.log('Access token error: ', error.message);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<p>ERROR: ' + error + '</p>');
    res.end();
  } else {
    getUserEmail(token.token.access_token, function(error, email){
      if (error) {
        console.log('getUserEmail returned an error: ' + error);
        res.write('<p>ERROR: ' + error + '</p>');
        res.end();
      } else if (email) {
        var cookies = ['node-tutorial-token=' + token.token.access_token + ';Max-Age=4000',
                       'node-tutorial-refresh-token=' + token.token.refresh_token + ';Max-Age=4000',
                       'node-tutorial-token-expires=' + token.token.expires_at.getTime() + ';Max-Age=4000',
                       'node-tutorial-email=' + email + ';Max-Age=4000'];
        res.setHeader('Set-Cookie', cookies);
        res.writeHead(302, {'Location': 'http://localhost:'+port+'/mail'});
        res.end();
      }
    });
  }
}

function getValueFromCookie(valueName, cookie) {
  if (cookie.indexOf(valueName) !== -1) {
    var start = cookie.indexOf(valueName) + valueName.length + 1;
    var end = cookie.indexOf(';', start);
    end = end === -1 ? cookie.length : end;
    return cookie.substring(start, end);
  }
}

function getAccessToken(req, res, callback) {
  var expiration = new Date(parseFloat(getValueFromCookie('node-tutorial-token-expires', req.headers.cookie)));

  if (expiration <= new Date()) {
    // refresh token
    console.log('TOKEN EXPIRED, REFRESHING');
    var refresh_token = getValueFromCookie('node-tutorial-refresh-token', req.headers.cookie);
    authHelper.refreshAccessToken(refresh_token, function(error, newToken){
      if (error) {
        callback(error, null);
      } else if (newToken) {
        var cookies = ['node-tutorial-token=' + newToken.token.access_token + ';Max-Age=4000',
                       'node-tutorial-refresh-token=' + newToken.token.refresh_token + ';Max-Age=4000',
                       'node-tutorial-token-expires=' + newToken.token.expires_at.getTime() + ';Max-Age=4000'];
        res.setHeader('Set-Cookie', cookies);
        callback(null, newToken.token.access_token);
      }
    });
  } else {
    // Return cached token
    var access_token = getValueFromCookie('node-tutorial-token', req.headers.cookie);
    callback(null, access_token);
  }
}
