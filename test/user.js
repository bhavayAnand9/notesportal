process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let users = require('../model/Users');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();

chai.use(chaiHttp);

describe('new user', () => {
    it('it should generate a new test user', (done) => {
        let newUser = {
            "name": "test user",
            "email": ,
            "password": "test",
            "about": "it's for testing purposes",
            "college": "testing college of testing"
        }
        chai.request(server)
            .post('/user/signup')
            .send(newUser)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('operation').eql('successful');
                // res.body.errors.pages.should.have.property('kind').eql('required');
                done();
            });
    })
})