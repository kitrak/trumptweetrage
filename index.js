const express = require('express')
var Twitter = require('twitter')
const app = express()

var client = new Twitter({
	consumer_key: '',
	consumer_secret: '',
	access_token_key: '',
	access_token_secret: ''
})

client.stream('statuses/filter', {follow: 'twitter'},  function(stream) {
  stream.on('data', function(tweet) {
    console.log(tweet.text);
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});

app.get('/', (req, res) => {
	res.send("We don't have tweets yet but we're working on it!")
})

app.listen(3000, function() {
	console.log("Listening on 3000")
})

