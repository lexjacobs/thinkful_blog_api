const express = require('express');
const app = express();
const uuid = require('uuid');
const blogPostRouter = require('./blogPostRouter');
const morgan = require('morgan');

app.use(morgan('tiny'));
app.use('/blog-posts', blogPostRouter)

app.all('*', function(request, response) {
  response.send('<html><head></head><body>hello, world!</body></html>');
});

let server;

function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise(function(resolve, reject) {
    server = app
      .listen(port, function() {
        console.log(`Your app is listening on port ${port}`);
        resolve(server);
      })
      .on('error', function(error) {
        reject(error);
      })
  });
}

function closeServer() {
  return new Promise(function(resolve, reject) {
    console.log('Closing server');
    server.close(function(error) {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

if (require.main === module) {
  runServer().catch(function(error) {
    console.error(error);
  });
}

module.exports =  {
  app, runServer, closeServer
}
