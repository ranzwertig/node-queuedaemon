_ = require 'underscore'
clientTools = require './tools/clienttools'
Preserver = require './preserver'
events = require 'events'
errors = require './errors'

class QueueDaemon extends events.EventEmitter

    constructor: (options) ->

        if not options.client
            throw new errors.queuedaemon.InvalidOptionsError 'No database client in options! Please provide a mongo collection or a redis client.'

        @options = _.extend
            ttlLifetime: 0
            noJobsInQueueTimeout: 10 * 1000
            nextJobTimeout: 0
            recoverOnStartup: false
            tmpQueueName: 'recover'
            queueName: 'queue'
            skipJobOnParserError: true
        , options

        @_hasRecovered = false
        @_stopped = false
        @_stoppedCallback = () ->

        # detect client
        clientType = clientTools.detectClientType @options.client

        if clientType
            @preserver = Preserver.create clientType.toLowerCase(), @options
        else
            throw new errors.queuedaemon.UnsupportedDbClientError 'Unsupported database client in options detected!'

    _recover: (startAfterRecovering=false, cb=->) =>
        @preserver.recover (error, ttl) =>
            if error
                if error instanceof errors.preserver.JobTTLExpiredError
                    if startAfterRecovering
                        @start()
                    @emit 'error', new errors.queuedaemon.SkippedJobTTLError 'Skipped Job due to TTL expiration!', null, error
                    cb new errors.queuedaemon.SkippedJobTTLError 'Skipped Job due to TTL expiration!', null, error
                else
                    @emit 'error', new errors.queuedaemon.FailedRecoveryError 'Unable to recover!', null, error
                    cb new errors.queuedaemon.FailedRecoveryError 'Unable to recover!', null, error
            else
                @_hasRecovered = true
                if startAfterRecovering
                    @start()
                cb null

    start: (runOnce=false) =>

        # should recover before start
        if @options.recoverOnStartup and @_hasRecovered is false
            @_recover true    
            return    

        # return if daemon was stopped
        if @_stopped
            @_stoppedCallback()
            return

        done = () =>
            @preserver.jobDone (error) =>
                if error
                    @_stopped = true
                    @emit 'error', error

                if not runOnce
                    if @options.nextJobTimeout > 0
                        setTimeout @start, @options.nextJobTimeout
                    else
                        @start()

        # get the first job from queue
        @preserver.getJob (error, job) =>
            if error
                # on DbClientError stop daemon
                if error instanceof errors.preserver.DbClientError
                    @_stopped = true
                    @emit 'error', error
                # if there is a JsonParserError 
                else if error instanceof errors.preserver.JsonParserError
                    @emit 'parsererror', error
                    if @options.skipJobOnParserError
                        done()
                    else
                        @_stopped = true
                # id queue is empty
                else if error instanceof errors.preserver.QueueDrainedError
                    @emit 'drain'
                    if not runOnce
                        setTimeout @start, @options.noJobsInQueueTimeout
            else
                @emit 'job', done, job

    stop: (cb) =>
        @_stoppedCallback = cb
        @_stopped = true





module.exports = QueueDaemon