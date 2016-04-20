'use strict';

// import {should} from 'chai';
const should = require('chai').should();

const Hapi = require('hapi');
const MongoPlug = require('../lib');

describe('MongoPlug', () => {

  describe('#register', (done) => {

    let server;

    beforeEach((done) => {
      server = new Hapi.Server();
      done();
    });

    it('should connect to mongodb://localhost:27017/ by default', (done) => {
      server.register({
        register: MongoPlug
      }, (err) => {
        should.not.exist(err);
        done();
      });
    });

    it('should throw an error when port is invalid', (done) => {
      server.register({
        register: MongoPlug,
        options: {
          url: 'mongodb://localhost:12345/'
        }
      }, (err) => {
        should.exist(err);
        err.should.have.property('name').equal('MongoError')
        done();
      });
    });

    it('should have an exposed db object', (done) => {
      server.register({
        register: MongoPlug
      }, (err) => {
        should.not.exist(err);
        should.exist(server.db);
        done();
      });
    });

    // it('should do in an exposed db object', (done) => {
    // });

    describe('#attributes', () => {
      // TODO
    });
  });
});
