(function() {
  var Daemon, client, daemon, options, redis;

  Daemon = require('../lib/queuedaemon');

  redis = require('redis');

  client = redis.createClient();

  options = {
    client: client,
    nextJobTimeout: 2000,
    recoverOnStartup: true,
    ttlLifetime: 10
  };

  daemon = new Daemon(options);

  daemon.on('error', function(error) {
    return console.log(error);
  });

  daemon.on('drain', function() {
    return console.log('queue drained');
  });

  daemon.on('job', function(done, job) {
    console.log('processing job');
    console.log(job);
    if (job.hello === 'foo7') {
      throw new Error();
    }
    return done();
  });

  daemon.on('parsererror', function(error) {
    return console.log(error);
  });

  daemon.start();

  process.on('SIGINT', function() {
    console.log('exiting process');
    return daemon.stop(function() {
      console.log('daemon stopped');
      return process.exit(0);
    });
  });

}).call(this);
