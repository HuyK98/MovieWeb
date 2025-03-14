const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/movieweb', { useNewUrlParser: true, useUnifiedTopology: true });

const moviesRouter = require('./routes/movies');

app.use('/movies', moviesRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
