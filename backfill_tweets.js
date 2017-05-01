const twitter = require('./models/twitter');
const mongo = require('./models/mongo');
const config = require('./config');

twitter.get('statuses/user_timeline', { screen_name: 'realDonaldTrump', count: 3 }, function(error, tweets, resp) {
    if(error) throw error;
    //console.log(tweets);
    console.log(tweets.length);


    for(var i = 0; i < tweets.length; i++) {
        var obj = tweets[i];
        console.log(obj.id);

        //Check if it's already in mongo. If not, get the oembed message and store it in the database.
        let url = config.mongo.uri;
        mongo.connect(url, function (err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } else {
                var collection = db.collection('tweets');

                // Get the embedded HTML
                var embed_url = 'https://twitter.com/realDonaldTrump/status/' + obj.id_str
                var embed_html = '';
                twitter.get('statuses/oembed', {url: embed_url, hide_media: true}, function(error, etweet, resp) {
                    if(error) throw error;
                    embed_html = etweet.html;
                    console.log(embed_html);  // The html tweet

                    let created_date = new Date(Date.parse(obj.created_at))
                    var tweet = { tweet_id: obj.id,
                        embed_id: obj.id_str,
                        user: {id: obj.user.id, id_str: obj.user.id_str, name: obj.user.name, screen_name: obj.user.screen_name},
                        text: obj.text,
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
    }



});
