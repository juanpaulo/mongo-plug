'use strict';

const MongoClient = require('mongodb').MongoClient;

exports.register = (server, options, next) => {
  const url = options.url || 'mongodb://localhost:27017';
  const settings = options.settings || {};

  MongoClient.connect(url, settings, (err, db) => {
    if (err) {
      return next(err);
    }

    server.log(['mongo-plug','info'], `MongoDB client connected to ${url}`);
    server.decorate('server', 'db', db);
    next();
  });
};

exports.register.attributes = {
  pkg: require('../package.json')
};
