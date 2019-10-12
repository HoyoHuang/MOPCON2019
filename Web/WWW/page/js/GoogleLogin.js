var googleUser = {};
var startApp = function() {
    gapi.load('auth2', function(){
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        auth2 = gapi.auth2.init({
            client_id: '41386861907-i3093ieo0htqj96rut34op8np229givs.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
            // Request scopes in addition to 'profile' and 'email'
            scope: 'profile email'
        });
        attachSignin(document.getElementById('GoogleLogin'));
    });
};
startApp();

//
function attachSignin(element) {
    //console.log(element.id);
    auth2.attachClickHandler(element, {}, function(googleUser) {
        onSignIn(googleUser);
    }, function(error) {
        alert(JSON.stringify(error, undefined, 2));
    });
}

function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();

    $.ajax({
        url: 'index.php?a=GoogleOauth&b=SignIn',
        type: 'post',
        dataType: 'json',
        data: {
            id: profile.getId(),
            Name: profile.getName(),
            Email: profile.getEmail(),
            ImageURL: profile.getImageUrl()
        },
        success: function(json){

            if ( json['Result'] ==true ){
                window.localStorage.Token = json['Data']['Token'];
                //$('.Login').hide();
                //$('.SignedOut').show();
                //x.close();
                window.location.reload();
            }

        }
    });

    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
}
