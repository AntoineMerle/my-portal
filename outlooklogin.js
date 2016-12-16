
  function signIn() {
      ADAL.login();
  }

  function userSignedIn(err, token) {
      console.log('userSignedIn called');
      if (!err) {
          console.log("token: " + token);
          showWelcomeMessage();
      }
      else {
          console.error("error: " + err);
      }
  }

  function showWelcomeMessage() {
      var user = ADAL.getCachedUser();
      var divWelcome = document.getElementById('WelcomeMessage');
      divWelcome.innerHTML = "Welcome " + user.profile.name;
  }

exports.signIn = signIn;
exports.userSignedIn = userSignedIn;
exports.showWelcomeMessage = showWelcomeMessage;
