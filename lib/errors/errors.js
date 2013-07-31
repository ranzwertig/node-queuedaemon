(function() {
  var CustomError, DbClientError, JsonParserError, QueueDrainedError, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  _ = require('underscore');

  CustomError = (function(_super) {

    __extends(CustomError, _super);

    function CustomError() {
      var args, data, message, reason;
      message = arguments[0], data = arguments[1], reason = arguments[2], args = 4 <= arguments.length ? __slice.call(arguments, 3) : [];
      this.message = message;
      this.data = data;
      this.reason = reason;
      CustomError.__super__.constructor.apply(this, args);
    }

    return CustomError;

  })(Error);

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

}).call(this);
