const express = require('express')
var Twitter = require('twitter')
var Tortoise = require('tortoise')
const app = express()
const pg = require('pg');

tortoise = new Tortoise('amqp://localhost')

const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/rdt';

var client = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
})

client.stream('statuses/filter', {follow: '25073877, 279118291'}, function(stream) {
  stream.on('data', function(event) {
  	if(event.user.id == 25073877 || event.user.id == 279118291) {
  		//console.log(event.text)	
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

tortoise
  .queue('twitter-stream', { durable: false })
  .prefetch(1)
  .subscribe(function(msg, ack, nack) {
    // Handle 
    console.log(msg)
    var obj = JSON.parse(msg)
    //console.log(obj)
    //console.log(msg['event'])
    console.log(obj.event.created_at)
    dt = obj.event.created_at
    db_date = new Date(Date.parse(dt))

 //    pg_client.connect();
 //    const query = pg_client.query
 //    ('INSERT INTO tweets(json_text, created_at) VALUES($1, $2)', obj.event, db_date)
	// query.on('end', () => { pg_client.end(); });


	pg.connect(connectionString, function (err, client, done) {
		if (err) {
		  // pass the error to the express error handler
		  return next(err)
		}
		client.query('INSERT INTO tweets(json_text, created_at) VALUES($1, $2)', [obj.event, db_date], function (err, result) {
		  done() //this done callback signals the pg driver that the connection can be closed or returned to the connection pool

		  if (err) {
		    // pass the error to the express error handler
		    console.log(err)
		  }

		  //res.send(200)
		})
	})

  ack(); // or nack(); 
});

app.get('/', (req, res) => {
	res.send("We don't have tweets yet but we're working on it!")
})

app.listen(3000, function() {
	console.log("Listening on 3000")
})

