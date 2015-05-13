var async = require('async')
var elasticsearch = require('elasticsearch')
var Redis = require('redis')
var redis = Redis.createClient({
  no_ready_check: true,
  max_attempts: 0,
})

// Redis.debug_mode = true

var es = new require('elasticsearch').Client({
  host: process.env.ES_URL+'/mediabin/',
})

var miaCaptionQ = async.queue(function(filename, callback) {
  var fn = filename.replace(/_crop/i, '')
  es.search({q: '"'+fn+'*"', size: 1, fields: ["id", "filename"]}).then(function (result) {
    var hit = result.hits.hits.filter(function(hit) { return hit.fields.id })[0]
    var id = hit && hit.fields.id[0]
    if(id) {
      redis.hget('object:'+~~(id/1000), id, function(err, reply) {
        if(err) return callback("error - id not in redis? "+id)
          var meta = JSON.parse(reply)
        meta.filename = filename
        return callback(null, meta)
      })
    } else {
      callback('error - no id')
    }
  })
}, 3)

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
