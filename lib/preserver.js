(function() {
  var Preserver, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  _ = require('underscore');

  Preserver = (function() {

    function Preserver() {
      this.jobDone = __bind(this.jobDone, this);

      this.getJob = __bind(this.getJob, this);

    }

    Preserver.prototype.getJob = function() {};

    Preserver.prototype.jobDone = function() {};

    Preserver.create = function() {
      var P, args, name;
      name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      P = (require('./preservers/' + name)).Preserver;
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(P, args, function(){});
    };

    return Preserver;

  })();

  module.exports = Preserver;

}).call(this);
