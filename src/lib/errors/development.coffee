_ = require 'underscore'
CustomError = require './custom'

class NotImplementedError extends CustomError

module.exports.NotImplementedError = NotImplementedError
