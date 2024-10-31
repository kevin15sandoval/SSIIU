var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
var debug = require("debug")("moviesApp:server");
var jwt = require("jsonwebtoken");

// Token generation imports
const dotenv = require('dotenv');
// get config vars
dotenv.config();

var debug = require("debug")("moviesAppAuth:server");

//Models
var Movie = require("../models/Movie.js");

mongoose.set("strictQuery", false);
var db = mongoose.connection;

//ESTE SE HA REALIZADO PARA LA TAREA

router.get("/secure", tokenVerify, 
  function (req, res, next) {
      debug("Acceso seguro con token a las pelis");
      Movie.find().sort("-creationdate").exec(function (err, movies) {
          if (err) res.status(500).send(err);
          else res.status(200).json(movies);
      })
  });

/* GET movies listing */
router.get("/", function (req, res) {
  Movie.find().then(function (movies) {
    if (movies) {
      debug("Movies found:", movies);
    } else {
      debug("No movies found.");
    }
    res.status(200).json(movies)
  }).catch(function (err) {
    res.status(500).send(err)
  });
});

/* GET single movie by Id */
router.get("/:id", function (req, res) {
  Movie.findById(req.params.id).then(function (movieinfo) {
    if (movieinfo) {
      debug("Movie found:", movieinfo);
      res.status(200).json(movieinfo);
    } else {
      res.status(404).send("Movie not found");
    }
  }).catch(function (err) {
    res.status(500).send(err);
  });
});

//verificamos los tokens
function tokenVerify (req, res, next) {
  var authHeader=req.get('authorization');
  const retrievedToken = authHeader;//truco
  
  if (!retrievedToken) {
      res.status(401).send({
          ok: false,
          message: "Token inválido"
      })
  }else{       
      jwt.verify(retrievedToken, process.env.TOKEN_SECRET,  function (err, retrievedToken) {
          if (err) {
              res.status(401).send({
                  ok: false,
                  message: "Token inválido"
              });
          } else {
              next();
          }
      });
  }
}

// POST de un nuevo pelicula
//ESTE SE HA REALIZADO PARA LA TAREA

router.post("/secure", tokenVerify, crearPelis);
 function crearPelis (req, res, next) {

  Movie.create(req.body).then(function (movie) {
    res.status(201).json(movie);
  }).catch(function (err) {
    res.status(500).send(err);    
  });
};
  // /* POST a new movie*/
  // router.post("/", function (req, res) {
  //   Movie.create(req.body, function (err, movieinfo) {
  //     if (err) res.status(500).send(err);
  //     else res.sendStatus(200);
  //   });
  // });

    /* POST a new movie (ahora conviene hacerlo todo con promesas) */

    router.post("/", function (req, res) {
      Movie.create(req.body).then(function (movie) {
        res.status(201).json(movie);
      }).catch(function (err) {
        res.status(500).send(err);
      });
    });
  
  module.exports = router;

  