_ = require 'underscore'
CustomError = require './custom'

class InvalidOptionsError extends CustomError

module.exports.InvalidOptionsError = InvalidOptionsError

class UnsupportedDbClientError extends CustomError

module.exports.UnsupportedDbClientError = UnsupportedDbClientError

class FailedRecoveryError extends CustomError

module.exports.FailedRecoveryError = FailedRecoveryError

class SkippedJobTTLError extends CustomError

module.exports.SkippedJobTTLError = SkippedJobTTLError