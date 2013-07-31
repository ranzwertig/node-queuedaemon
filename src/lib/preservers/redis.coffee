_ = require 'underscore'
errors = require '../errors'

class RedisPreserver

    constructor: (@options) ->

    recover: (cb) =>
        @options.client.llen @options.tmpQueueName, (error, items) =>
            if error
                cb new errors.preserver.DbClientError('Error in recover - redis llen!', null, error), null
                return 

            # is there anything to recover in queue
            if items < 1
                cb null, 0
            else
                @options.client.rpoplpush @options.tmpQueueName, @options.tmpQueueName, (error, rawRecoveredJob) =>
                    if error
                        cb new errors.preserver.DbClientError('Error in recover - redis rpoplpush!', null, error), null
                        return 

                    if rawRecoveredJob is null
                        cb null, 0
                        return

                    if @options.ttlLifetime > 0
                        console.log 'lifetime:'
                        try
                            recoveredJob = JSON.parse rawRecoveredJob
                        catch parserError
                            cb new errors.preserver.JsonParserError('Error parsing recovered job!', rawRecoveredJob, parserError), null
                            return

                        console.log 'parsed'


                        discardJob = (discardJobToQueue) =>
                            @options.client.lpop @options.tmpQueueName, (error, data) =>
                                if error
                                    cb new errors.preserver.DbClientError('Error in deleting expired recover job - redis lpop!', null, error), null
                                    return

                                if discardJobToQueue['__QueueDaemonRecoverTTL'] is 0
                                    cb new errors.preserver.JobTTLExpiredError('Recovery TTL expired!', discardJobToQueue, null), null
                                else
                                    cb null, discardJobToQueue['__QueueDaemonRecoverTTL']

                        requeueJob = (recoveredJobToQueue) =>
                            @options.client.rpush @options.queueName, JSON.stringify(recoveredJobToQueue), (error, data) ->
                                if error
                                    cb new errors.preserver.DbClientError('Error in requeueing not expired recover job - redis lpush!', recoveredJobToQueue, error), null

                                discardJob recoveredJobToQueue

                        if typeof recoveredJob['__QueueDaemonRecoverTTL'] is 'undefined'
                            console.log 'lifetime: new'
                            recoveredJob['__QueueDaemonRecoverTTL'] = @options.ttlLifetime
                            requeueJob(recoveredJob)
                        else if recoveredJob['__QueueDaemonRecoverTTL'] > 0
                            console.log 'lifetime: ' + recoveredJob['__QueueDaemonRecoverTTL']
                            # job still has some ttl: decrease ttl
                            recoveredJob['__QueueDaemonRecoverTTL'] = recoveredJob['__QueueDaemonRecoverTTL'] - 1
                            requeueJob(recoveredJob)

                        if recoveredJob['__QueueDaemonRecoverTTL'] is 0
                            # delete job from queue because its expired
                            discardJob(recoveredJob)

                    else
                        console.log 'requeue'
                        @options.client.rpoplpush @options.tmpQueueName, @options.queueName, (error, data) ->
                            if error
                                cb new errors.preserver.DbClientError('Error in requeueing job - redis rpoplpush!', recoveredJob, error), null
                            cb null, 1
            


    getJob: (cb) =>
        @options.client.rpoplpush @options.queueName, @options.tmpQueueName, (error, rawJob) =>
            if error
                cb new errors.preserver.DbClientError('Error in getJob - redis rpoplpush!', null, error), null
                return

            # no jobs in queue
            if rawJob is null
                cb new errors.preserver.QueueDrainedError("No jobs in queue: #{@options.tmpQueueName}!", null, null), null
                return

            try
                job = JSON.parse rawJob
            catch parserError
                cb new errors.preserver.JsonParserError('Error parsing job!', rawJob, parserError), null
                return

            cb null, job

    jobDone: (cb) =>
        @options.client.lpop @options.tmpQueueName, (error, rawJob) =>
            if error
                cb new errors.preserver.DbClientError('Error in jobDone - redis lpop!', null, error)
            else
                cb null


module.exports.Preserver = RedisPreserver
