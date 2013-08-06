(function() {
  var CustomError, NotImplementedError, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore');

  CustomError = require('./custom');

  NotImplementedError = (function(_super) {

    __extends(NotImplementedError, _super);

    function NotImplementedError() {
      return NotImplementedError.__super__.constructor.apply(this, arguments);
    }

    return NotImplementedError;

  })(CustomError);

  module.exports.NotImplementedError = NotImplementedError;

}).call(this);
