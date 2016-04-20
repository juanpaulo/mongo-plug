// 'use strict';

const should = require('chai').should();

const Hapi = require('hapi');
const MongoPlug = require('../lib');

describe('MongoPlug', () => {

  describe('Connecting', (done) => {

    let server;

    beforeEach((done) => {
      server = new Hapi.Server();
      done();
    });

    // afterEach((done) => {
    //   server.db.close();
    //   done();
    // });

    // MongoDB connection
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
        err.should.have.property('name').equal('MongoError');
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

  });

  describe('CRUD Operations', (done) => {

    let server;

    beforeEach((done) => {
      server = new Hapi.Server();
      server.register({
        register: MongoPlug
      }, (err) => {
        done();
      });
    });

    // Inserting Documents
    it('should be able to create a single document', (done) => {
      server.db.collection('test').insertOne({foo: 'bar'}, (err, doc) => {
        should.exist(doc);
        doc.should.have.deep.property('result.ok').equal(1);
        doc.should.have.deep.property('result.n').equal(1);
        // {foo: 'bar'}
        done();
      });
    });

    it('should be able to create multiple documents', (done) => {
      server.db.collection('test').insertMany([{foo: 'bar'}, {foo: 'baz'}], (err, doc) => {
        doc.should.have.deep.property('result.ok').equal(1);
        doc.should.have.deep.property('result.n').equal(2);
        // {foo: 'bar'}
        // {foo: 'bar'}
        // {foo: 'baz'}
        done();
      });
    });

    // Updating Documents
    it('should be able to update a single document', (done) => {
      server.db.collection('test').updateOne({foo: 'bar'}, {$set: {foo: 'baz'}}, (err, doc) => {
        doc.should.have.deep.property('result.ok').equal(1);
        doc.should.have.deep.property('result.nModified').equal(1);
        done();
        // {foo: 'bar'}
        // {foo: 'baz'}
        // {foo: 'baz'}
      });
    });

    it('should be able to update multiple documents', (done) => {
      server.db.collection('test').updateMany({foo: 'baz'}, {$set: {foo: 'bar'}}, (err, doc) => {
        should.exist(doc);
        doc.should.have.deep.property('result.ok').equal(1);
        doc.should.have.deep.property('result.nModified').equal(2);
        done();
        // {foo: 'bar'}
        // {foo: 'bar'}
        // {foo: 'bar'}
      });
    });

    it('should be able to remove a single document', (done) => {
      server.db.collection('test').deleteOne({foo: 'bar'}, (err, doc) => {
        should.exist(doc);
        doc.should.have.deep.property('result.ok').equal(1);
        doc.should.have.deep.property('result.n').equal(1);
        done();
        // {foo: 'bar'}
        // {foo: 'bar'}
      });
    });

    it('should be able to remove multiple documents', (done) => {
      server.db.collection('test').deleteMany({foo: 'bar'}, (err, doc) => {
        should.exist(doc);
        doc.should.have.deep.property('result.ok').equal(1);
        doc.should.have.deep.property('result.n').equal(2);
        done();
      });
    });

  });
});
