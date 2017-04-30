const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const app = express()
const mongo = require('../models/mongo')
const config = require('../config')

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
}))

app.set('port', (process.env.PORT || 5000));

app.use(express.static('../public'))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    let url = config.mongo.uri
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //var tweet = db.collection('tweets').find().sort({created_at: -1}).limit(1);
            db.collection('tweets').find().sort({created_at: -1}).limit(3).toArray(function(err, docs) {
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

app.listen(app.get('port'), function() {
    console.log('Listening on port', app.get('port'))
})
