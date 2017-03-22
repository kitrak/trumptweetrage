const Tortoise = require('tortoise')
tortoise = new Tortoise('amqp://localhost')

// read from the queue and update stats
tortoise
	.queue('twitter-stats', { durable: false })
	.prefetch(1)
	.subscribe(function(msg, ack, nack) {
		const obj_msg = JSON.parse(msg)
		console.log(obj_msg)
		const user = obj_msg.user
		console.log(user)
		// now re-calculate statistics and update.
	})