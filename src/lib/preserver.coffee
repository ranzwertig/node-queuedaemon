_ = require 'underscore'


class Preserver

    constructor: () ->

    getJob: () =>

    jobDone: () =>


    @create: (name, args...) ->
        P = (require './preservers/' + name).Preserver
        return new P args...

module.exports = Preserver