const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');

router.get('/', async (req, res) => {
  try {
    const movies = await Movie.aggregate([
      {
        $lookup: {
          from: 'showtimes',
          localField: '_id',
          foreignField: 'movieId',
          as: 'showtimes'
        }
      }
    ]);
    res.json(movies);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
