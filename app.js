var tmi = require("tmi.js")
var constants = require("./const.js")
var votes = [];
var directions = ["f","b","r","l"]; //Move direction Array
var commands = ["help"];
var voteTally = true;
//TODO: Set Botname

var botName = ""
/*
  Setup static twitch options like cluster and users
*/
var options = {
  options: {
    debug: true
  },
  connection: {
    cluster: "aws",
    reconnect: true
  },
  identity: {
  //TODO: Set Twitch UserName
    username: "",
    //TODO: Set OATH Toaken
    password: ""
  },
  //
  channels: ["robocarbot"]
};

var client = new tmi.client(options);
client.connect();

/*
  Monitors chat log, add functionality here for desired response to users.
*/
client.on('chat', function(channel, user, message, self) {
  if(message.charAt(0) == '!' && voteTally) {
    temp = message.slice(1);
    temp = temp.split(" ")[0];
    if(directions.includes(temp)) {
      addVote(user, message);
    } else if (commands.includes(temp)){
      commandResponse(user, temp);
    }
  }
});

/*
Setup the connection to Twitch, Alert users when it's active
*/
client.on('connected', function(address, port) {
  console.log("Address: " + address + " Port: " + port);
  //how to send a message to users
  client.action(botName, "Hello, The Bot Is Here");
});

/*
@command - Command the user sent to the bot.
@user - User that issued the command
*/
function commandResponse(user,command) {
  //TODO: Add commands for the bot
  client.action(botName, constants.help);
}

/*
Voter function
@user = user voting
@message = the vote the user is sending
*/
function addVote(user, message) {
  var add = true;
  try {
    votes.forEach(function(item) {
      console.log(item[0])
      if(item[0] == user['display-name']) {
        add = false;
        client.action(botName, "You already voted, please wait until next round to vote again.");
        throw BreakException;
      }
    });
  } catch (e) {
  }
  if ( add == true) {
    votes.push([user['display-name'],message]);
    client.action(botName, "Vote Counted");
  }
}

/*
  Count votes to find the highest vote
*/
function findHighVote() {
  var temp = [];
  votes.forEach(function(item) {
    temp.push(item[1]);
  });
}

/*
Counts votes, resets timer. logs information
*/
function countVotes() {
  client.action(botName, "Hello, The Bot is here");
  voteTally = false;
  console.log("Votes: " + votes);
  votes.forEach(function (item) {
    if (item[1] == '!l') { //Left Turn Vote
      left = left + 1;
    } else if (item == '!r') { // Right Turn Vote
      right = right + 1;
    } else if (item == '!f') { // Forward Vote
      forward = forward + 1;
    } else if (item == '!b') { // Backward Vote
      backward = backward + 1;
    }
  });
  moveTimer()
};

/*
  Manage vote timer.
*/
function voteTimer() {
  votes = [];
  voteTally = true;
  client.action(botName, "Hello, The Bot voting is open");
  setTimeout(countVotes, 60000);
};

/*
  This function is the players move time.
*/
function moveTimer() {
client.action(botName, "Hello, The Bot is moving, voting closed");
  setTimeout(voteTimer, 30000);
};

voteTimer()
