class CustomError extends Error

    constructor: (@message, @data, @reason, args...) ->
        super args...

module.exports = CustomError