(function() {
  var CustomError, FailedRecoveryError, InvalidOptionsError, SkippedJobTTLError, UnsupportedDbClientError, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore');

  CustomError = require('./custom');

  InvalidOptionsError = (function(_super) {

    __extends(InvalidOptionsError, _super);

    function InvalidOptionsError() {
      return InvalidOptionsError.__super__.constructor.apply(this, arguments);
    }

    return InvalidOptionsError;

  })(CustomError);

  module.exports.InvalidOptionsError = InvalidOptionsError;

  UnsupportedDbClientError = (function(_super) {

    __extends(UnsupportedDbClientError, _super);

    function UnsupportedDbClientError() {
      return UnsupportedDbClientError.__super__.constructor.apply(this, arguments);
    }

    return UnsupportedDbClientError;

  })(CustomError);

  module.exports.UnsupportedDbClientError = UnsupportedDbClientError;

  FailedRecoveryError = (function(_super) {

    __extends(FailedRecoveryError, _super);

    function FailedRecoveryError() {
      return FailedRecoveryError.__super__.constructor.apply(this, arguments);
    }

    return FailedRecoveryError;

  })(CustomError);

  module.exports.FailedRecoveryError = FailedRecoveryError;

  SkippedJobTTLError = (function(_super) {

    __extends(SkippedJobTTLError, _super);

    function SkippedJobTTLError() {
      return SkippedJobTTLError.__super__.constructor.apply(this, arguments);
    }

    return SkippedJobTTLError;

  })(CustomError);

  module.exports.SkippedJobTTLError = SkippedJobTTLError;

}).call(this);
