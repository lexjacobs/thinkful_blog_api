const express = require('express');
const app = express();
const uuid = require('uuid');
const blogPostRouter = require('./blogPostRouter');
const morgan = require('morgan');

app.use(morgan('tiny'));
app.use('/blog-posts', blogPostRouter)

app.all('*', function(request, response) {
  response.send('fell through');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`app is listening on ${PORT}`);
});
