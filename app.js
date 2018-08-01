/*
TO DO:

use blue snowball as mic in house

#cmds.js#
-Currently if key words are used in filler text, the command is invalid,
prehaps check if the keywords are in the correct places after parsing.
-Commands need to be able to have no filler text and not have issues e.g. pause/stop (currently no problems)
-Check if keywords have space before and after as currently 'John player' is working as John play er
-What is this song?
-What's this song called?
-What is this song's name?
-What's this song named?

#app.js#
-Create playlist
-Add to playlist
-Remove from playlist
-Follow
-Unfollow
-Favourite
-Unfavourite
-Text to speach replies

#index.html#
-Add mute and live mic commands so they can be accessed by text
-Lock command entry until token is granted
-Get refresh token every hour so token is always working

#layout.css#
-Float or position login button to stop disforming the page when shrinking
*/

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var cmds = require("./cmds.js");
var fs = require('fs');

var SpotifyWebApi = require('spotify-web-api-node');

var child_process = require('child_process');

var client_id = ''; // Your client id
var client_secret = ''; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri
var access_token = '';
var refresh_token = '';

var spotifyApi = new SpotifyWebApi({
  clientId : client_id,
  clientSecret : client_secret,
  redirectUri : redirect_uri
});

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
	.use(cookieParser());

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-modify-playback-state user-read-currently-playing';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        access_token = body.access_token;
        refresh_token = body.refresh_token;
		
		console.log(access_token);
				
        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log("Got your user data...");
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

/*Functions for corresponding command library*/
function play(args){
	var track = args[0];
	var err = null;
	track_uri = "";
	find_name = "";

	var options = {
		url: 'https://api.spotify.com/v1/search?'+
		querystring.stringify({
		q: track,
		type: 'track'
		}),
		headers: { 'Authorization': 'Bearer ' + access_token },
		json: true
	};	
	
	//async problems, scope is wrong. Need to seperate variables somehow, turn off async?
	
	request.get(options, function(error, response, body) {
		if(body.hasOwnProperty('tracks')){
			if(body.tracks.hasOwnProperty('items')){
				if (typeof body.tracks.items !== 'undefined' && body.tracks.items.length > 0){
					track_uri = body.tracks.items[0].uri;
					find_name = body.tracks.items[0].name;

request({
	method: 'PUT',
	uri: 'https://api.spotify.com/v1/me/player/play',
	headers:{
		Authorization: 'Bearer ' + access_token
	},
	data:{
		"context_uri": "spotify:user:spotifyhwp:playlist:5XpO873pTWez7aV6RuOsW1",
		"offset": {
			"position": 0
		}
	}
}, function (error, response, body) {	
	console.log(response);						
});						
				}
				else{
					return 'Failed to find tracks with query: '+track;
				}
			}
			else{
				return 'Failed to find tracks with query: '+track;
			}
		}
		else{
			return 'Failed to find tracks with query: '+track;
		}
		if (track_uri == ""){
			return 'Failed to find tracks with query: '+track;
		}
		//console.log(body.tracks.items[0]);
		if (err == null){
			return "Playing "+track;
		}	
		else{
			return err;
		}		
	});
		
}

function resume(args){
	var err = null;
	
	request({
			method: 'PUT',
			uri: 'https://api.spotify.com/v1/me/player/play',
			headers:{
				Authorization: 'Bearer ' + access_token
			}
		}, function (error, response, body) {
			err = error;
		});	

	if (err == null){
		return "Resuming current track";
	}
	
	return err;		
}

function pause(args){
	var err = null;
	
	request({
			method: 'PUT',
			uri: 'https://api.spotify.com/v1/me/player/pause',
			headers:{
				Authorization: 'Bearer ' + access_token
			}
		}, function (error, response, body) {
			err = error;
		});	
		
	if (err == null){
		return "Pausing current track";
	}
	
	return err;	
}

function createplaylist(args){
	var name = args[0];
	var err = null;
	
	if (err == null){
		return "Created new playlist: "+name;
	}
	
	return err;	
}

function currentsong(args){
	var err = null;
	
	var options = {
	  url: 'https://api.spotify.com/v1/me/player/currently-playing',
	  headers: { 'Authorization': 'Bearer ' + access_token }
	};

	// use the access token to access the Spotify Web API
	request.get(options, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			//console.log(body);
		}
		else{
			err = error;
		}
	});	
	
	if (err == null){
		return "Current song: ";
	}
	
	return err;	
}

function volume(args){
	var volume = args[0];
	var err = null;
  
	var isnum = /^\d+$/.test(volume);
	if (isnum){
		volume = Math.min(Math.max(volume, 0), 100);
		request({
			method: 'PUT',
			uri: 'https://api.spotify.com/v1/me/player/volume?volume_percent='+volume,
			/*querystring.stringify({
				volume_percent: volume
			}),*/
			headers: { 'Authorization': 'Bearer ' + access_token }
			}, function (error, response, body) {
				if (!error && response.statusCode === 200) {
				
				}
				else{
					err = error;
				}
			});			
	}
	else{
		return "Volume must be a number between 0 and 100"
	}
	
	if (err == null){
		return "Volume set to: "+volume+"%";
	}
	
	return err;	
}

function nextsong(args){
	var err = null;
	
	var options = {
	  url: 'https://api.spotify.com/v1/me/player/next',
	  headers: { 'Authorization': 'Bearer ' + access_token }
	};	
	
	request.post(options, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			
		}
		else{
			err = error;
		}
	});	
	
	if (err == null){
		return "Playing next song";
	}
	
	return err;		
}

function previoussong(args){
	var err = null;
	
	var options = {
	  url: 'https://api.spotify.com/v1/me/player/previous',
	  headers: { 'Authorization': 'Bearer ' + access_token }
	};	
	
	request.post(options, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			
		}
		else{
			err = error;
		}
	});	
	
	if (err == null){
		return "Playing previous song";
	}
	
	return err;		
}

var funcs = [];
funcs['play'] = play;
funcs['resume'] = resume;
funcs['start'] = resume;
funcs['spotify'] = play;
funcs['pause'] = pause;
funcs['stop'] = pause;
funcs['createplaylist'] = createplaylist;
funcs['currentsong'] = currentsong;
funcs['currentlyplaying'] = currentsong;
funcs['volume'] = volume;
funcs['setvolume'] = volume;
funcs['nextsong'] = nextsong;
funcs['previoussong'] = previoussong;
/*-------------------------------------------*/

//Recieving commands from speech.js
app.get('/send_cmd', function(req, res) {
	// requesting access token from refresh token
	var getCmd = req.query.cmd;
	var isCmd = false;
	var cmdResponse = cmds.isCommand(getCmd);
	var cmdName = cmdResponse[0];
	var cmdParams = cmdResponse[1];
	var reply = "";
	if (cmdName != ""){
		reply = funcs[cmdName](cmdParams);
		isCmd = true;		
	}
	console.log(getCmd);
	//Replying if command is valid
	res.send({
		'reply': reply,
		'is_cmd': isCmd
	});

});

console.log('Aerospeak App live on http://localhost:8888');
app.listen(8888);