const twitter = require('../../models/twitter')
const tortoise = require('../../models/rabbitmq')

twitter.stream('statuses/filter', {follow: '25073877, 279118291'}, function(stream) {
  stream.on('data', function(event) {
  	if(event.user.id == 25073877 || event.user.id == 279118291) {
      //logger.info(event.text)
  		console.log(event.text)	
  		tortoise
    		.queue('twitter-stream', { durable: false })
    		.publish({ event: event });
  	} else {
  		//console.log("Received unexpected event!")
  	}
    
    //console.log(event && event.text);

  });
 
  stream.on('error', function(error) {
  	console.log(error)
    throw error;
  });
});