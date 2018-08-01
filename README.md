# Aerospeak
Aerospeak is a voice controlled Node.js App for Spotify Music Player, using Google Speech Recognition and Spotify API. This system works similarly to other voice recognition systems, such as Alexa or Siri, however it's purpose is for complete control over Spotify functions. It can be deployed on any web server, and be used to control music from any of your devices connected to spotify, via the web interface.

![alt text](https://i.imgur.com/4QtJtVA.png)

Note: To use this app, you must own a Spotify Premium account, in order to have access to the developer API commands.

## Commands
Commands can be executed by Voice or Text input, however when communicating via voice, you must use the prefix 'John' to gain the systems attention. e.g. 'John resume' or 'John volume 100'. If you are using text input on the app, you can simply use the commands below, without the prefix.

### Working Commands
* 'resume' or 'start' - Resumes the currently paused song on your device.
* 'pause' or 'stop' - Pauses the currently playing song on your device.
* 'volume' or 'setvolume' (0-100) - Sets the volume of your Spotify player between 0 and 100.
* 'nextsong' - Starts playing the next song on your device.
* 'previoussong' - Starts playing the previous song on your device.

### Future Commands
* 'play' (song name) - Search for and play the requested song on your device.
* 'favourite' or 'likethis' - Add the currently playing song to your collection.
* 'createplaylist' (playlist name) - Create a new playlist on your Spotify with the given name.
* 'addtoplaylist' (playlist name) - Adds the currently playing song to your given Spotify playlist.
* 'currentlyplaying' - Gets the title and artist of the song currently playing on your Spotify.

The end-goal of this software, is to have full flexibility over controlling every available Spotify function, using simple Voice recognition. This app could then be used in the home to control your music from your seat, without paying a penny.
