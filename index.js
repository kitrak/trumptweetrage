const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
var Twitter = require('twitter')
var Tortoise = require('tortoise')
const app = express()
const pg = require('pg');
var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/rdt';

app.engine('.hbs', exphbs({  
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts')
}))

app.use(express.static('public'))
app.set('view engine', '.hbs')  
app.set('views', path.join(__dirname, 'views'))

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
    created_date = db_date

 //    pg_client.connect();
 //    const query = pg_client.query
 //    ('INSERT INTO tweets(json_text, created_at) VALUES($1, $2)', obj.event, db_date)
	// query.on('end', () => { pg_client.end(); });
  // Insert into Mongodb
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      //HURRAY!! We are connected. :)
      console.log('Connection established to', url);

      var collection = db.collection('tweets');

      // Get the embedded HTML
      var screen_name = obj.event.user.screen_name
      var embed_url = 'https://twitter.com/' + screen_name + '/status/' + obj.event.id_str
      var embed_html = ''
      client.get('statuses/oembed', {url: embed_url}, function(error, etweet, resp) {
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
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      //var tweet = db.collection('tweets').find().sort({created_at: -1}).limit(1);
      db.collection('tweets').find().sort({created_at: -1}).limit(3).toArray(function(err, docs) {
        
        console.log("Printing doc from Array")
        //console.log(docs[0].embed_html)

        var twit = [docs[0].embed_html, docs[1].embed_html, docs[2].embed_html]

        //console.log(twit)

        res.render('home', {
          tweets: twit
        })  

        // docs.forEach(function (doc) {
        //   console.log("Doc from Array ");
        //   //console.dir(doc);
        //   var tweet = doc
        //   console.log(tweet.embed_html)
        //   // find the most recent tweet and display it
        //   res.render('home', {
        //     tweets: [tweet.embed_html]
        //   })      
        // })
      })   
    }
    // res.render('home', {
    //   tweet: 'Sorry, an error occurred'
    // })
  })
})

app.listen(3000, function() {
	console.log("Listening on 3000")
})

