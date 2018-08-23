const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {BlogPosts} = require('./models');

// create: function(title, content, author, publishDate)
BlogPosts.create('Why You Should Eat More Jelly Doughnuts', 'Because Weird Al said so', 'Weird Al');
BlogPosts.create('Is Elvis\' Brain Being Kept Alive Inside A Jar?', 'No', 'Elvis');

router.get('/', function(request, response) {
  console.log('retrieving all blog posts');
  response.json(BlogPosts.get())
});

router.post('/', jsonParser, function(request, response) {
  var requiredFields = ['title', 'content', 'author'];
  for(var i = 0; i < requiredFields.length; i++) {
    if (!(requiredFields[i] in request.body)) {
      var message = `Missing required field '${requiredFields[i]}'`
      return response.status(400).send(message);
    }
  }
  console.log('creating new blog post');
  const {title, content, author, publishDate} = request.body;
  const post = BlogPosts.create(title, content, author, publishDate);
  response.status(201).send(`Created item ${post.id}`);

});

router.delete('/:id', function(request, response) {
  BlogPosts.delete(request.params.id);
  console.log('deleted item');
  response.status(204).send(`deleted item ${request.params.id}`);
});

router.put('/:id', jsonParser,function(request, response) {
  var requiredFields = ['title', 'content', 'author', 'id'];
  for(var i = 0; i < requiredFields.length; i++) {
    if (!(requiredFields[i] in request.body)) {
      var message = `Missing required field '${requiredFields[i]}'`
      return response.status(400).send(message);
    }
  }
  if (request.params.id !== request.body.id) {
    return response.status(400).send('id\'s don\'t match');
  }
  console.log(`Updating item ${request.body.id}`);
  BlogPosts.update({
    id: request.body.id,
    title: request.body.title,
    content: request.body.content,
    author: request.body.author
  })
  response.status(204).end();

});

module.exports = router;
