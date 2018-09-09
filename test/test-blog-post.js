const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const { runServer, closeServer, app } = require('../server');

chai.use(chaiHttp);

/* global describe it */
describe('blog-post', function() {
  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('sends a list of the blog posts when receiving GET', function() {
    return chai
      .request(app)
      .get('/blog-posts')
      .then(function(response) {
        expect(response).to.be.json;
        expect(response).to.have.status(200);
        expect(response.body.length).to.be.at.least(1);
        expect(response.body).to.be.a('array');
        const expectedKeys = ['title', 'content', 'author', 'id'];
        response.body.forEach(function(item) {
          expect(item).to.include.keys(expectedKeys);
          expect(item).to.be.a('object');
        });
      });
  });
  it('creates a new blog post with POST', function() {
    var testInput = {
      title: 'test posted title',
      content: 'test posted content',
      author: 'test posted author'
    };
    return chai
      .request(app)
      .post('/blog-posts')
      .send(testInput)
      .then(function(response) {
        expect(response).to.have.status(201);
        expect(response).to.be.html;
      });
  });
  it('does not create a new blog post with missing parameters', function() {
    var testInput = {
      content: 'test posted content',
      author: 'test posted author'
    };
    return chai
      .request(app)
      .post('/blog-posts')
      .send(testInput)
      .then(function(response) {
        expect(response).to.have.status(400);
      });
  });
  it('updates a blog post with PUT', function() {
    var updatedPost = {
      title: 'test updated title',
      content: 'test updated content',
      author: 'test updated author'
    };
    // first get id
    return chai
      .request(app)
      .get('/blog-posts')
      .then(function(response) {
        let id = response.body[0].id;
        updatedPost.id = id;
        return chai
          .request(app)
          .put(`/blog-posts/${id}`)
          .send(updatedPost);
      })
      .then(function(response) {
        expect(response).to.have.status(204);
      });
  });

  it('does not update a blog post with PUT when missing parameter', function() {
    var updatedPost = {
      title: 'test updated title',
      content: 'test updated content'
      // author: 'test updated author'
    };
    // first get id
    return chai
      .request(app)
      .get('/blog-posts')
      .then(function(response) {
        let id = response.body[0].id;
        updatedPost.id = id;
        return chai
          .request(app)
          .put(`/blog-posts/${id}`)
          .send(updatedPost);
      })
      .then(function(response) {
        expect(response).to.have.status(400);
      });
  });

  it('deletes a blog post with DELETE', function() {
    return chai
      .request(app)
      .get('/blog-posts')
      .then(function(response) {
        let id = response.body[0].id;
        return chai.request(app).delete(`/blog-posts/${id}`);
      })
      .then(function(response) {
        expect(response).to.have.status(204);
      });
  });
});
