const express = require('express')
const exphbs = require('express-handlebars')

const app = express()

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
}))

app.use(express.static('public'))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))

app.listen(3000, function() {
    console.log('Listening on 3000')
})

app.get('/', (req, res) => {
    MongoClient.connect(url, function (err, db) {
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
