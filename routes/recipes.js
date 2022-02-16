var express = require('express');
var router = express.Router();
router.use(express.json());

/* List all recipes */
router.get('/', async function(req, res, next) {
  let recipes = await req.app.locals.db.collection("recipes");
  res.json(await recipes.find().toArray());
});

/* Search recipe names using MongoDB's text search */
router.get('/name/:searchMe', async function(req, res, next) {
  console.log("Searching for recipes whose name include the word " + req.params.searchMe);
  let recipes = await req.app.locals.db.collection("recipes");
  res.json(await recipes.find({
    $text: { $search: req.params.searchMe }
  }).project({name: true}).toArray());
});

/* Search recipes that use certain ingredients 
(for example "beef" and "potato") */
router.get('/ingr/:foodTerms', async function(req, res, next) {
  foodList = req.params.foodTerms.split(',');
  console.log("Searching for recipes that use the ingredients " + foodList);
  let recipes = await req.app.locals.db.collection("recipes");
  res.json(await recipes.find({
    'ingredients.food': {
      $all: foodList
    }
  }).project({name: true}).toArray());
});

/* Add a recipe */
router.post('/new-recipe/', 
async function(req, res, next) {
  let recipes = await req.app.locals.db.collection("recipes");
  recipes.insertOne(req.body, function(err) {
    if (err) throw err;
    res.status(201).send(req.body);
  });
});

module.exports = router;
