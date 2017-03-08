const express = require('express')
const app = express()

app.get('/', (req, res) => {
	res.send("We don't have tweets yet but we're working on it!")
})

app.listen(3000, function() {
	console.log("Listening on 3000")
})

