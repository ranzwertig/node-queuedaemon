redis = require 'redis'

module.exports.detectClientType = (client) ->

    # check if node_redis client
    if client instanceof redis.RedisClient and typeof client.rpoplpush is 'function' and typeof client.lpop is 'function' and typeof client.lpush is 'function' and typeof client.rpop is 'function'
        return 'REDIS'

    if typeof client.insert isnt 'undefined' and typeof client.find isnt 'undefined' and typeof client.findOne isnt 'undefined' and typeof client.update isnt 'undefined'
        return 'MONGODB'

    return false