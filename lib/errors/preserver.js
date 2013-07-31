(function() {
  var CustomError, DbClientError, JobTTLExpiredError, JsonParserError, QueueDrainedError, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore');

  CustomError = require('./custom');

  JsonParserError = (function(_super) {

    __extends(JsonParserError, _super);

    function JsonParserError() {
      return JsonParserError.__super__.constructor.apply(this, arguments);
    }

    return JsonParserError;

  })(CustomError);

  module.exports.JsonParserError = JsonParserError;

  QueueDrainedError = (function(_super) {

    __extends(QueueDrainedError, _super);

    function QueueDrainedError() {
      return QueueDrainedError.__super__.constructor.apply(this, arguments);
    }

    return QueueDrainedError;

  })(CustomError);

  module.exports.QueueDrainedError = QueueDrainedError;

  DbClientError = (function(_super) {

    __extends(DbClientError, _super);

    function DbClientError() {
      return DbClientError.__super__.constructor.apply(this, arguments);
    }

    return DbClientError;

  })(CustomError);

  module.exports.DbClientError = DbClientError;

  JobTTLExpiredError = (function(_super) {

    __extends(JobTTLExpiredError, _super);

    function JobTTLExpiredError() {
      return JobTTLExpiredError.__super__.constructor.apply(this, arguments);
    }

    return JobTTLExpiredError;

  })(CustomError);

  module.exports.JobTTLExpiredError = JobTTLExpiredError;

}).call(this);
