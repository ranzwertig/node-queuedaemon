Daemon = require '../lib/queuedaemon'
redis = require 'redis'

client = redis.createClient()

options =
    client: client
    nextJobTimeout: 2000
    recoverOnStartup: true
    ttlLifetime: 10

daemon = new daemon.QueueDaemon options

daemon.on 'error', (error) ->
    console.log error

daemon.on 'drain', () ->
    console.log 'queue drained'

daemon.on 'job', (done, job) ->
    console.log 'processing job'
    console.log job
    if job.hello is 'foo7'
        throw new Error()
    done()

daemon.on 'parsererror', (error) ->
    console.log error

daemon.start()

process.on 'SIGINT', () ->
    console.log 'exiting process'
    daemon.stop () ->
        console.log 'daemon stopped'
        process.exit 0
