var router = require('express').Router();
var pg = require('pg');

var config = {
  database: 'phi-tasks',
  host: 'localhost',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000
};

var pool = new pg.Pool(config);

// get all tasks
router.get('/', function(req, res) {
  console.log('hit my get all tasks route');
  pool.connect(function(err, client, done) {
    if(err){
      console.log(err);
      res.sendStatus(500);
    }else{
      // SELECT * FROM task;
      client.query('SELECT * FROM task OREDR BY id;', function(err, result) {
        done(); // close the connection db

        if(err){
          console.log(err);
          res.sendStatus(500); // the world exploded
        }else{
          console.log(result.rows);
          res.status(200).send(result.rows);
        }
      });
    }
  });
});

// create a new task in the db
router.post('/', function(req, res) {
  console.log('hit post route');
  console.log('here is the body ->', req.body);

  var taskObject = req.body;

  // db query
  // INSERT INTO task (name) VALUES ('test');
  pool.connect(function(err, client, done) {
    if(err){
      console.log(err);
      res.sendStatus(500);
    }else{
      client.query('INSERT INTO task (name) VALUES ($1);',
        [taskObject.name], function(err, result) {
          done();
          if(err){
            console.log(err);
            res.sendStatus(500); // the world exploded
          }else{
            res.sendStatus(201);
          }
      });
    }
  });
});

router.delete('/:id', function(req, res) { // : makes this a parameter
  var taskToDeleteId = req.params.id; //body is data (req.body), params is built out from url
  console.log('hit delete route');
  console.log('here is the id to complete ->', taskToDeleteId);

  pool.connect(function(err, client, done) {
    if(err){
      console.log(err);
      res.sendStatus(500);
    }else{
      client.query('DELETE FROM task WHERE id=$1;',
        [taskToDeleteId], function(err, result) {
          done();
          if(err){
            console.log(err);
            res.sendStatus(500);
          }else{
            res.sendStatus(200);
          }
      });
    }
  });
});

router.put('/:id', function(req, res) { // : makes this a parameter
  var taskToCompleteId = req.params.id; //body is data (req.body), params is built out from url
  console.log('hit complete route');
  console.log('here is the id to complete ->', taskToCompleteId);

  pool.connect(function(err, client, done) {
    if(err){
      console.log(err);
      res.sendStatus(500);
    }else{
      client.query('UPDATE task SET status = TRUE WHERE id = $1;',
        [taskToCompleteId], function(err, result) {
          done();
          if(err){
            console.log(err);
            res.sendStatus(500);
          }else{
            res.sendStatus(200);
          }
      });
    }
  });
});

module.exports = router;
