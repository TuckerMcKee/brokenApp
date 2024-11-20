const express = require('express');
const axios = require('axios');
const ExpressError = require('./expressError.js');
const app = express();

app.use(express.json());

app.post('/', function(req, res, next) {
  console.log('IN POST ROUTE')
  try {
    let results = req.body.developers.map(async d => {
      return await axios.get(`https://api.github.com/users/${d}`);
    });
    console.log(results)
    let out = results.map(r => ({ name: r.data.name, bio: r.data.bio }));

    return res.send(JSON.stringify(out));
  } catch {
    next(err);
  }
});

app.use(function(req, res, next) {
  return new ExpressError("Not Found", 404);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err.message,
  });
});

app.listen(3000);
