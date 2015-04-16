var async = require('async')
var elasticsearch = require('elasticsearch')
var Redis = require('redis')
var redis = Redis.createClient({
	no_ready_check: true,
	max_attempts: 0,
})

// Redis.debug_mode = true

var es = new require('elasticsearch').Client({
  host: process.env.ES_URL+'/mediabin/object_images',
})

var miaCaptionQ = async.queue(function(filename, callback) {
	// return callback('test')
  es.search({q: filename, size: 1, fields: ["id", "filename"]}).then(function (result) {
		var hit = result.hits.hits[0]
		var id = hit && hit.fields.id[0]
		if(id) {
			redis.hget('object:'+~~(id/1000), id, function(err, reply) {
				if(err) return callback('error')
				var meta = JSON.parse(reply)
				meta.filename = filename
				return callback(meta)
			})
		} else {
			callback('error')
		}
	})
}, 1)

module.exports = {
	q: miaCaptionQ,
	done: function() {
		redis.unref(function(arg1) { })
		// redis.end()
		// redis.hget('object:0', 1)
		// console.log(redis.end, redis.unref, redis.quit)
		process.exit()
	},
}
redis.on("error", function (err) {
	console.log("redis Error " + err);
});
