
const express = require('express');
const router = express.Router();
const Joi = require('joi');

// Consider a resource called --> Movies

let movies = [
    {
        'id': 1,
        'name': 'Inception',
        'genre': ['sci-fi', 'thriller'],
        'year': 2015
    },
    {
        'id': 2,
        'name': 'Inception 2',
        'genre': ['sci-fi', 'thriller'],
        'year': 2015
    },
    {
        'id': 3,
        'name': 'Inception 3',
        'genre': ['sci-fi', 'thriller'],
        'year': 2015
    },
    {
        'id': 4,
        'name': 'Inception 4',
        'genre': ['sci-fi', 'thriller'],
        'year': 2015
    }
];


// CRUD Operations
// --------------------------------------
// 1. Get all movies
router.get('/movies', (req, res) => {
    // 1. find all movies from DB or array
    let resp;
    if (movies.length > 0) {
        resp = JSON.stringify(movies);
    } else {
        resp = JSON.stringify({'message': 'no movies yet!'});
    }

    // return as a response
    res.setHeader('content-type', 'application/json');
    res.status(200).send(resp);
});
// 2. Get a specific movie
router.get('/movies/:id', (req, res) => {
    // extract id from the incoming request
    const id = req.params?.id;
    // lookup a record against that id
    const movie = movies.find(m => m.id === parseInt(id));
    // if not found return a 404 error message
    res.setHeader('content-type', 'application/json');
    if (!movie) {
        return res.status(404).send(JSON.stringify({'message': 'The movie you are looking for is not there!'}));
    }
    // else we return the record/movie
    res.status(200).send(JSON.stringify(movie));
});
// 3. Create/Add a new movie
router.post('/movies', (req, res) => {
    // extract data from the body of incoming request
    const newMovie = req.body;
    // we can validate the data

    const {error, value} = validateMovie(newMovie);
    // if error return a 400 error message
    res.setHeader('content-type', 'application/json');
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    // add the movie to db or dummy implementation
    newMovie.id = movies.length + 1;
    movies.push(newMovie);
    // else we return the added record/movie
    res.status(200).send(newMovie);
});
// 4. Update a movie information
router.put('/movies/:id', (req, res) => {
    // extract id from the incoming request
    const id = req.params?.id;
    // lookup a record against that id
    const movie = movies.find(m => m.id === parseInt(id));
    // if not found return a 404 error message
    res.setHeader('content-type', 'application/json');
    if (!movie) {
        return res.status(404).send(JSON.stringify({'message': 'The movie you are looking for is not there!'}));
    }
    /// extract data from the body of incoming request
    const data = req.body;
    // we can validate the data
    const movieSchema = Joi.object({
        name: Joi.string().min(4).required(),
        year: Joi.number().required(),
        genre: Joi.array().required()
    });
    const {error, value} = movieSchema.validate(data);
    // if error return a 400 error message
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    // if no errors then we can update the record/movie
    const indexOfMovie = movies.indexOf(movie);
    movie.name = data.name;
    movie.genre = data.genre;
    movie.year = data.year;

    movies[indexOfMovie] = movie;
    res.status(200).send(movie);
});
// 5. Delete a movie
router.delete('/movies/:id', (req, res) => {
    // extract id from the incoming request
    const id = req.params?.id;
    // lookup a record against that id
    const movie = movies.find(m => m.id === parseInt(id));
    // if not found return a 404 error message
    res.setHeader('content-type', 'application/json');
    if (!movie) {
        return res.status(404).send(JSON.stringify({'message': 'The movie you are looking for is not there!'}));
    }
    // else delete the record/movie
    const index = movies.indexOf(movie);
    movies.splice(index, 1);
    res.status(200).send('Success');
});

function validateMovie(movie) {
    const movieSchema = Joi.object({
        name: Joi.string().min(4).required(),
        year: Joi.number().required(),
        genre: Joi.array().required()
    });
    return movieSchema.validate(movie);
}

module.exports = router;
