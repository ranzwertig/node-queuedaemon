(function() {
  var RedisPreserver, errors, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore');

  errors = require('../errors');

  RedisPreserver = (function() {

    function RedisPreserver(options) {
      this.options = options;
      this.jobDone = __bind(this.jobDone, this);

      this.getJob = __bind(this.getJob, this);

      this.recover = __bind(this.recover, this);

    }

    RedisPreserver.prototype.recover = function(cb) {
      var _this = this;
      return this.options.client.llen(this.options.tmpQueueName, function(error, items) {
        if (error) {
          cb(new errors.preserver.DbClientError('Error in recover - redis llen!', null, error), null);
          return;
        }
        if (items < 1) {
          return cb(null, 0);
        } else {
          return _this.options.client.rpoplpush(_this.options.tmpQueueName, _this.options.tmpQueueName, function(error, rawRecoveredJob) {
            var discardJob, recoveredJob, requeueJob;
            if (error) {
              cb(new errors.preserver.DbClientError('Error in recover - redis rpoplpush!', null, error), null);
              return;
            }
            if (rawRecoveredJob === null) {
              cb(null, 0);
              return;
            }
            if (_this.options.ttlLifetime > 0) {
              console.log('lifetime:');
              try {
                recoveredJob = JSON.parse(rawRecoveredJob);
              } catch (parserError) {
                cb(new errors.preserver.JsonParserError('Error parsing recovered job!', rawRecoveredJob, parserError), null);
                return;
              }
              console.log('parsed');
              discardJob = function(discardJobToQueue) {
                return _this.options.client.lpop(_this.options.tmpQueueName, function(error, data) {
                  if (error) {
                    cb(new errors.preserver.DbClientError('Error in deleting expired recover job - redis lpop!', null, error), null);
                    return;
                  }
                  if (discardJobToQueue['__QueueDaemonRecoverTTL'] === 0) {
                    return cb(new errors.preserver.JobTTLExpiredError('Recovery TTL expired!', discardJobToQueue, null), null);
                  } else {
                    return cb(null, discardJobToQueue['__QueueDaemonRecoverTTL']);
                  }
                });
              };
              requeueJob = function(recoveredJobToQueue) {
                return _this.options.client.rpush(_this.options.queueName, JSON.stringify(recoveredJobToQueue), function(error, data) {
                  if (error) {
                    cb(new errors.preserver.DbClientError('Error in requeueing not expired recover job - redis lpush!', recoveredJobToQueue, error), null);
                  }
                  return discardJob(recoveredJobToQueue);
                });
              };
              if (typeof recoveredJob['__QueueDaemonRecoverTTL'] === 'undefined') {
                console.log('lifetime: new');
                recoveredJob['__QueueDaemonRecoverTTL'] = _this.options.ttlLifetime;
                requeueJob(recoveredJob);
              } else if (recoveredJob['__QueueDaemonRecoverTTL'] > 0) {
                console.log('lifetime: ' + recoveredJob['__QueueDaemonRecoverTTL']);
                recoveredJob['__QueueDaemonRecoverTTL'] = recoveredJob['__QueueDaemonRecoverTTL'] - 1;
                requeueJob(recoveredJob);
              }
              if (recoveredJob['__QueueDaemonRecoverTTL'] === 0) {
                return discardJob(recoveredJob);
              }
            } else {
              console.log('requeue');
              return _this.options.client.rpoplpush(_this.options.tmpQueueName, _this.options.queueName, function(error, data) {
                if (error) {
                  cb(new errors.preserver.DbClientError('Error in requeueing job - redis rpoplpush!', recoveredJob, error), null);
                }
                return cb(null, 1);
              });
            }
          });
        }
      });
    };

    RedisPreserver.prototype.getJob = function(cb) {
      var _this = this;
      return this.options.client.rpoplpush(this.options.queueName, this.options.tmpQueueName, function(error, rawJob) {
        var job;
        if (error) {
          cb(new errors.preserver.DbClientError('Error in getJob - redis rpoplpush!', null, error), null);
          return;
        }
        if (rawJob === null) {
          cb(new errors.preserver.QueueDrainedError("No jobs in queue: " + _this.options.tmpQueueName + "!", null, null), null);
          return;
        }
        try {
          job = JSON.parse(rawJob);
        } catch (parserError) {
          cb(new errors.preserver.JsonParserError('Error parsing job!', rawJob, parserError), null);
          return;
        }
        return cb(null, job);
      });
    };

    RedisPreserver.prototype.jobDone = function(cb) {
      var _this = this;
      return this.options.client.lpop(this.options.tmpQueueName, function(error, rawJob) {
        if (error) {
          return cb(new errors.preserver.DbClientError('Error in jobDone - redis lpop!', null, error));
        } else {
          return cb(null);
        }
      });
    };

    return RedisPreserver;

  })();

  module.exports.Preserver = RedisPreserver;

}).call(this);
