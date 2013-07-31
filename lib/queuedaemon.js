(function() {
  var Preserver, QueueDaemon, clientTools, errors, events, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore');

  clientTools = require('./tools/clienttools');

  Preserver = require('./preserver');

  events = require('events');

  errors = require('./errors');

  QueueDaemon = (function(_super) {

    __extends(QueueDaemon, _super);

    function QueueDaemon(options) {
      this.stop = __bind(this.stop, this);

      this.start = __bind(this.start, this);

      this._recover = __bind(this._recover, this);

      var clientType;
      if (!options.client) {
        throw new errors.queuedaemon.InvalidOptionsError('No database client in options! Please provide a mongo collection or a redis client.');
      }
      this.options = _.extend({
        ttlLifetime: 0,
        noJobsInQueueTimeout: 10 * 1000,
        nextJobTimeout: 0,
        recoverOnStartup: false,
        tmpQueueName: 'recover',
        queueName: 'queue',
        skipJobOnParserError: true
      }, options);
      this._hasRecovered = false;
      this._stopped = false;
      this._stoppedCallback = function() {};
      clientType = clientTools.detectClientType(this.options.client);
      if (clientType) {
        this.preserver = Preserver.create(clientType.toLowerCase(), this.options);
      } else {
        throw new errors.queuedaemon.UnsupportedDbClientError('Unsupported database client in options detected!');
      }
    }

    QueueDaemon.prototype._recover = function(startAfterRecovering, cb) {
      var _this = this;
      if (startAfterRecovering == null) {
        startAfterRecovering = false;
      }
      if (cb == null) {
        cb = function() {};
      }
      return this.preserver.recover(function(error, ttl) {
        if (error) {
          if (error instanceof errors.preserver.JobTTLExpiredError) {
            if (startAfterRecovering) {
              _this.start();
            }
            _this.emit('error', new errors.queuedaemon.SkippedJobTTLError('Skipped Job due to TTL expiration!', null, error));
            return cb(new errors.queuedaemon.SkippedJobTTLError('Skipped Job due to TTL expiration!', null, error));
          } else {
            _this.emit('error', new errors.queuedaemon.FailedRecoveryError('Unable to recover!', null, error));
            return cb(new errors.queuedaemon.FailedRecoveryError('Unable to recover!', null, error));
          }
        } else {
          _this._hasRecovered = true;
          if (startAfterRecovering) {
            _this.start();
          }
          return cb(null);
        }
      });
    };

    QueueDaemon.prototype.start = function(runOnce) {
      var done,
        _this = this;
      if (runOnce == null) {
        runOnce = false;
      }
      if (this.options.recoverOnStartup && this._hasRecovered === false) {
        this._recover(true);
        return;
      }
      if (this._stopped) {
        this._stoppedCallback();
        return;
      }
      done = function() {
        return _this.preserver.jobDone(function(error) {
          if (error) {
            _this._stopped = true;
            _this.emit('error', error);
          }
          if (!runOnce) {
            if (_this.options.nextJobTimeout > 0) {
              return setTimeout(_this.start, _this.options.nextJobTimeout);
            } else {
              return _this.start();
            }
          }
        });
      };
      return this.preserver.getJob(function(error, job) {
        if (error) {
          if (error instanceof errors.preserver.DbClientError) {
            _this._stopped = true;
            return _this.emit('error', error);
          } else if (error instanceof errors.preserver.JsonParserError) {
            _this.emit('parsererror', error);
            if (_this.options.skipJobOnParserError) {
              return done();
            } else {
              return _this._stopped = true;
            }
          } else if (error instanceof errors.preserver.QueueDrainedError) {
            _this.emit('drain');
            if (!runOnce) {
              return setTimeout(_this.start, _this.options.noJobsInQueueTimeout);
            }
          }
        } else {
          return _this.emit('job', done, job);
        }
      });
    };

    QueueDaemon.prototype.stop = function(cb) {
      this._stoppedCallback = cb;
      return this._stopped = true;
    };

    return QueueDaemon;

  })(events.EventEmitter);

  module.exports = QueueDaemon;

}).call(this);
