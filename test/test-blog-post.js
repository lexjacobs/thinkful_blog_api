const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const {runServer, closeServer, app} = require('../server');

chai.use(chaiHttp);

/* global describe it */
describe('blog-post', function() {

  before(function() {
    return runServer();
  })

  after(function() {
    return closeServer();
  })

  it('sends a list of the blog posts when receiving GET', function() {
    return chai.request(app).get('/blog-posts')
    .then(function(result) {
      expect(result).to.be.json;
      expect(result).to.have.status(200);
      expect(result.body.length).to.be.at.least(1);
      expect(result.body).to.be.a('array');
      const expectedKeys = ['title', 'content', 'author', 'id'];
      result.body.forEach(function(item) {
        expect(item).to.include.keys(expectedKeys);
        expect(item).to.be.a('object');
      });
    });
  });
});
