process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let users = require('./model/Users');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./index');
let should = chai.should();

chai.use(chaiHttp);

describe()