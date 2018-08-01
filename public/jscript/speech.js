var muted = false;
var r = document.getElementById('live-cmd');

function startConverting () {
	if('webkitSpeechRecognition' in window){
		var speechRecognizer = new webkitSpeechRecognition();
		speechRecognizer.continuous = false;
		speechRecognizer.interimResults = true;
		speechRecognizer.lang = 'en-GB';
		speechRecognizer.start();

		var finalTranscripts = '';

		speechRecognizer.onresult = function(event){
			var interimTranscripts = '';
			for(var i = event.resultIndex; i < event.results.length; i++){
				var transcript = event.results[i][0].transcript;
				transcript.replace("\n", "<br>");
				if(event.results[i].isFinal){
					finalTranscripts += transcript;
					finalTransLower = finalTranscripts.toLowerCase();
					if (getCommand(finalTransLower) == "mute microphone" || getCommand(finalTransLower) == "mute mic"){
						muted = true;
						$('#mic-mute').text("muted");
						$('#mic-mute').css('color', 'red');
						$('#cmd-list').prepend('<li>'+formatCmd(finalTransLower,'Mic')+'</li>');
						//executeCmd("alertTest",window,"test");						
					}
					else if (getCommand(finalTransLower) == "live microphone" || getCommand(finalTransLower) == "live mic"){									
						muted = false;
						finalTranscripts = "";
						$('#mic-mute').text("live");
						$('#mic-mute').css('color', 'green');
					}
					/*else if (!isCommand(finalTransLower)){
						finalTransLower = null;
					}*/
					
					if (!muted & isCommand(finalTransLower)){							
						//send command to app.js
						$.ajax({
						  url: '/send_cmd',
						  data: {
							'cmd': finalTransLower
						  }
						}).done(function(data) {
							var reply = data.reply;
							var isCmd = data.is_cmd;
							if (isCmd){
								$('#cmd-list').prepend('<li>'+formatCmd(finalTransLower,'Mic')+'</li>');
								if (reply != ""){
									$('#cmd-list').prepend('<li>'+formatCmd(reply,'Reply')+'</li>');
								}								
							}
							else{
								$('#cmd-list').prepend('<li>'+formatCmd('Invalid Command ('+finalTransLower+')','Mic')+'</li>');
							}
						});
							
						finalTranscripts = "";
					}
					else{
						finalTranscripts = "";
					}
				}else{		
					interimTranscripts += transcript;
				}
			}
			if (!muted){
				r.innerHTML = finalTranscripts + '<span style="color:#999">' + interimTranscripts + '</span>';
			}
		};
		
		speechRecognizer.onend = function() {
			speechRecognizer.start();
			//r.innerHTML = finalTranscripts + '<span style="color:#999">END</span>';
		}
		
		speechRecognizer.onerror = function (event) {
		};
	}else{
		r.innerHTML = 'Your browser is not supported. If google chrome, please upgrade!';
	}
}

startConverting();