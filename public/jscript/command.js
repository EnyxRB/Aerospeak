var Nicknames = ["john", "johnny"];

function isName(Name){
	if (Nicknames.indexOf(Name)!=-1){
		return true;
	}	
	return false;
}

function alertTest(Text){
	alert(Text);
}

function getCommand(Text){
	Text = Text.toLowerCase();
	var words = Text.split(" ");
	if (isName(words[0])){
		words.shift();		
		return words.join(" ");
	}
	
	return "";
}

function isCommand(Text){
	var words = Text.split(" ");
	if (isName(words[0]) & words[1]!=null){
		return true;
	}
	else{
		return false;
	}
}

function formatCmd(Text, Source){
	var d = new Date();
	var h = d.getHours();
	var m = (d.getMinutes()<10?'0':'') + d.getMinutes();
	var s = d.getSeconds();
	
	var time = h+':'+m+':'+s;
	var Return = time + ' (' + Source + '): ' + Text;
	return Return;
}

function sendToPHP(query) {
	window.location.href = "get_data.php?q="+query;
	
	/* similar behavior as an HTTP redirect
	window.location.replace("http://stackoverflow.com");

	// similar behavior as clicking on a link
	window.location.href = "http://stackoverflow.com"; */
}