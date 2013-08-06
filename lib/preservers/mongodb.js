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

    /*
            Recovering a Mongo queue
            a document in a mongo queue has to have following attributes
    
            doc:
                createdAt: datetime
                isProcessing: boolean
                ttlLifetime: integer
    
            How to recover:
                1. get the document where isProcessing is true
                2. if the ttlLifetime is configured
                    2.1 if the ttlLifetime attribute already exist
                        2.1.1 decrement the ttlLifetime by 1
                    2.2 if there is no ttlLifetime attribute in the document
                        2.2.1 add the ttlLifetime attribute and set it to the configured value
                    2.3 if ttlLifetime is 0
                        throw errors.preserver.JobTTLExpiredError and delete document
                3. if ttlLifetime isnt configured or ttlLifetime > 0
                    3.1 set the attribute isProcessing to false
                4. revovery done!
    */


    RedisPreserver.prototype.recover = function(cb) {
      throw new errors.development.NotImplementedError('mongo recover not implemented yet');
      return cb(null, 0);
    };

    /*
            get the next job from mongo
            1. find the document with the oldest createdAt attribute in the collection
            2. set the documents isProcessing to true
            3. return the document
    */


    RedisPreserver.prototype.getJob = function(cb) {
      throw new errors.development.NotImplementedError('get job not implemented yet');
      return cb(null, job);
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
