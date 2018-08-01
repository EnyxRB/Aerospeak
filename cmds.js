var Nicknames = ["john", "johnny"];
var Version = '1.0';

var commands = [];
var commandNames = [];
var keywords = [];

function addCommand(name,args){
	commands[name] = args;
	commandNames.push(name);
	
	for (i = 0; i < args.length; i++){		
		if (args[i]!=""){	
			if (keywords.indexOf(args[i])==-1){
				keywords.push(args[i]);									
			}
		}
	}
}

/*----COMMAND LIBRARY----*/
addCommand("play",["play",""]);
addCommand("resume",["resume"]);
addCommand("start",["start"]);
addCommand("pause",["pause"]);
addCommand("stop",["stop"]);
addCommand("spotify",["spotify",""]);
addCommand("createplaylist",["create","playlist",""]);
addCommand("currentsong",["current","song"]);
addCommand("currentlyplaying",["currently","playing"]);
addCommand("volume",["volume",""]);
addCommand("setvolume",["set","volume",""]);
addCommand("nextsong",["next","song"]);
addCommand("previoussong",["previous","song"]);
/*-----------------------*/

//Keywords must be sorted by length so that bigger words are recognized in the keyword match
//before the shorter words e.g. Playlist before Play, so commands with similarites aren't made redundant.
keywords.sort(function(a, b){
  return b.length - a.length;
});

exports.executeCmd = function(functionName, context /*, args */) {
	var args = [].slice.call(arguments).splice(2);
	var namespaces = functionName.split(".");
	var func = namespaces.pop();
	for(var i = 0; i < namespaces.length; i++) {
		context = context[namespaces[i]];
	}
	return context[func].apply(context, args);
};

function isName(Name){
	if (Nicknames.indexOf(Name)>-1){
		return true;
	}	
	return false;
}

function uniqueArray(a) {
    var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

    return a.filter(function(item) {
        var type = typeof item;
        if(type in prims)
            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
        else
            return objs.indexOf(item) >= 0 ? false : objs.push(item);
    });
}

exports.isCommand = function(Cmd){	
	var words = Cmd.split(" ");
	if (isName(words[0])){		
		words.shift();		
		Cmd = words.join(" ");
		var match = Cmd.match(new RegExp(keywords.join("|"), "g"));
		if (match != null){
			//console.log(match);
			var uniqueMatch = uniqueArray(match);
			var cmdkey = uniqueMatch.join("");
			
			for(var i = 0; i < 1; i++) {
				
			}
			
			//technically all I have to do is try every variation of every keyword found until a match is found?
			//always take first keyword as base, will always be first word in cmdkey e.g. play(something)
			//the biggest amount of keywords in a cmdkey 

			
			//find all filler spaces between keywords in the string so that
			//a similar array can be formed e.g. "key","","key",""
			//and can be compared to all comands to see if it matches.
			
			//another error: aslong as it detects the keywords, it ignores if theres extra text e.g. "current song this is a test" works
			
			if (commandNames.indexOf(cmdkey)>-1){			
				//Extract data from data fields in arguements e.g. "Play" "SONGNAME" "by" "ARTIST"
				var argu = commands[cmdkey].slice(0);
				var params = [];
				
				var markers = [];
				var fillers = 0;
				
				for(var i = 0; i < argu.length; i++) {
					if (argu[i]!=""){
						var length = argu[i].length;
						
						if (i == 0){
							//Getting markers for all keywords used in command
							var pos = Cmd.indexOf(argu[i]);
							markers[i] = [pos,pos+length];
							//console.log(cmdkey.substring(markers[i][0],markers[i][1]));
						}
						else{
							var pos = Cmd.lastIndexOf(argu[i]);
							
							if (Cmd.substring(pos-(length+1),pos-1)==argu[i]){
								markers[i] = [pos-(length+1),pos-1];
							}
							else{
								markers[i] = [pos,pos+argu[i].length];		
							}							
						}
					}
					else {fillers++;}
				}
				
				//console.log(commands[cmdkey]);
				
				var tempCmd = argu.join(" ");
				//console.log(tempCmd);				
				for(var i = 0; i < argu.length; i++) {
					if (argu[i]==""){	
						if (i<(argu.length-1)){
							var str = Cmd.substring(markers[i-1][1]+1,markers[i+1][0]-1);
							params.push(str);
						}
						else{
							var str = Cmd.substring(markers[i-1][1]+1,Cmd.length);
							params.push(str);
						}
						
					}
				}
				
				var filled = true;
				
				for(var i = 0; i < fillers+1; i++) {
					if (params[i]==""){
						filled = false;
						break;
					}
				}

				if (filled){
				console.log("command is valid");
				return [cmdkey,params];
				}
				else{
					console.log("command invalid (no fillers)");
					return ["",null];
				}
				//executeCmd(cmdkey,process,'some bullshit song', 'johnny kys');
			}
			else{				
				console.log("Not a valid command")
				return ["",null];
			}
		}
		else{			
			console.log("No matches to string")
			return ["",null];
		}
	}
	else{
		console.log("Not a command (No nickname used)");
		return ["",null];
	}
};
