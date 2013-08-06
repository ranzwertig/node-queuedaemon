_ = require 'underscore'
errors = require '../errors'

class CustomPreserver

    constructor: () ->

    # set the options from the queuedaemon
    setQueueDaemonOptions: (options) ->
        @options = options

    # must throw:
    #   errors.preserver.DbClientError on any connection end db error
    #   errors.preserver.JobTTLExpiredError if the ttl of the job is expired
    #   errors.preserver.JsonParserError if the job isn't parsable
    recover: (cb) =>
        throw new errors.development.NotImplementedError 'recover not implemented yet'
        cb null, 0
       
    # must throw:
    #   errors.preserver.DbClientError on any connection end db error
    #   errors.preserver.QueueDrainedError if there are no more jobs
    #   errors.preserver.JsonParserError if the job isn't parsable
    getJob: (cb) =>
        throw new errors.development.NotImplementedError 'getJob not implemented yet'
        cb null, null

    # must throw:
    #   errors.preserver.DbClientError on any connection end db error
    jobDone: (cb) =>
        throw new errors.development.NotImplementedError 'jobDone not implemented yet'
        cb null

module.exports.Preserver = CustomPreserver
