(function() {
  var CustomError,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

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

  module.exports = CustomError;

}).call(this);
