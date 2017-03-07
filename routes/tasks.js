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
      client.query('SELECT * FROM task;', function(err, result) {
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

module.exports = router;
