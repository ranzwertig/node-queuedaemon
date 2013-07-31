(function() {
  var redis;

  redis = require('redis');

  module.exports.detectClientType = function(client) {
    if (client instanceof redis.RedisClient && typeof client.rpoplpush === 'function' && typeof client.lpop === 'function' && typeof client.lpush === 'function' && typeof client.rpop === 'function') {
      return 'REDIS';
    }
    if (typeof client.insert !== 'undefined' && typeof client.find !== 'undefined' && typeof client.findOne !== 'undefined' && typeof client.update !== 'undefined') {
      return 'MONGODB';
    }
    return false;
  };

}).call(this);
