(function() {
  var CustomPreserver, errors, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore');

  errors = require('../errors');

  CustomPreserver = (function() {

    function CustomPreserver() {
      this.jobDone = __bind(this.jobDone, this);

      this.getJob = __bind(this.getJob, this);

      this.recover = __bind(this.recover, this);

    }

    CustomPreserver.prototype.setQueueDaemonOptions = function(options) {
      return this.options = options;
    };

    CustomPreserver.prototype.recover = function(cb) {
      throw new errors.development.NotImplementedError('recover not implemented yet');
      return cb(null, 0);
    };

    CustomPreserver.prototype.getJob = function(cb) {
      throw new errors.development.NotImplementedError('getJob not implemented yet');
      return cb(null, null);
    };

    CustomPreserver.prototype.jobDone = function(cb) {
      throw new errors.development.NotImplementedError('jobDone not implemented yet');
      return cb(null);
    };

    return CustomPreserver;

  })();

  module.exports.Preserver = CustomPreserver;

}).call(this);
