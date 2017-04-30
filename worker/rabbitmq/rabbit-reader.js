'use strict'

const config = require('../../config')
const tortoise = require('../../models/rabbitmq')
const mongo = require('../../models/mongo')
const twitter = require('../../models/twitter')

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
    let dt = obj.event.created_at
    let db_date = new Date(Date.parse(dt))
    let created_date = db_date

  // Insert into Mongodb
  let url = config.mongo.uri
  mongo.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', url);

      var collection = db.collection('tweets');

      // Get the embedded HTML
      var screen_name = obj.event.user.screen_name
      var embed_url = 'https://twitter.com/' + screen_name + '/status/' + obj.event.id_str
      var embed_html = ''
      twitter.get('statuses/oembed', {url: embed_url, hide_media: true}, function(error, etweet, resp) {
        if(error) throw error;
        embed_html = etweet.html
        console.log(embed_html);  // The html tweet
        var tweet = { tweet_id: obj.event.id,
                embed_id: obj.event.id_str,
                user: {id: obj.event.user.id, id_str: obj.event.user.id_str, name: obj.event.user.name, screen_name: obj.event.user.screen_name},
                text: obj.event.text,
                embed_html: embed_html,
                created_at: created_date,
                updated_at: created_date
              };

        collection.insert([tweet], function (err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log('Inserted %d documents into the "tweets" collection. The documents inserted with "_id" are:', result.length, result);
          }
          //Close connection
          db.close();
        });
      });
    }
  });

	// pg.connect(connectionString, function (err, client, done) {
	// 	if (err) {
	// 	  // pass the error to the express error handler
	// 	  return next(err)
	// 	}
	// 	client.query('INSERT INTO tweets(json_text, created_at) VALUES($1, $2)', [obj.event, db_date], function (err, result) {
	// 	  done() //this done callback signals the pg driver that the connection can be closed or returned to the connection pool

	// 	  if (err) {
	// 	    // pass the error to the express error handler
	// 	    console.log(err)
	// 	  }

	// 	  //res.send(200)
	// 	})
	// })

  ack(); // or nack(); 
});