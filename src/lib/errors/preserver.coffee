_ = require 'underscore'
CustomError = require './custom'

class JsonParserError extends CustomError

module.exports.JsonParserError = JsonParserError

class QueueDrainedError extends CustomError

module.exports.QueueDrainedError = QueueDrainedError

class DbClientError extends CustomError

module.exports.DbClientError = DbClientError

class JobTTLExpiredError extends CustomError

module.exports.JobTTLExpiredError = JobTTLExpiredError
