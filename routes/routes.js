var express = require('express');
var router = express.Router();
const db = require('../db/database');

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
router.get('/', (req, res) => {
  let data = {
    title: 'Home',
    user: req.session.name || null,
    error: req.query.error,
    msg: req.query.msg,
  };

  db.all(`SELECT * FROM articles ORDER BY date desc LIMIT 1;`, (err, row) => {
    if (err) {
      console.log({
        errors: {
          status: 500,
          source: '/login',
          title: 'Database error',
          detail: err.message,
        },
      });
    }
    data.articles = row;

    res.render('home', {
      data: data,
      page: req.url,
    });
  });
});
router.get('/about', (req, res) => {
  let data = {
    title: 'About',
    user: req.session.name || null,
  };

  res.render('about', {
    data: data,
    page: req.url,
  });
});
router.get('/register', (req, res) => {
  let data = {
    title: 'Register user',
    error: req.query.error,
    msg: req.query.msg,
  };

  res.render('register', {
    data: data,
    page: req.url,
    user: req.session.name || null,
  });
});

router.post('/register', urlencodedParser, async (req, res) => {
  let sql = `INSERT INTO users (email, password, name) values(?, ?, ?);`;
  let error = '';
  db.run(
    sql,
    [req.body.email, req.body.password, req.body.name],
    (err, row) => {
      if (err) {
        error = err.message;
        res.redirect(
          '/register?error=A user with the email "' +
            req.body.email +
            '" already exists'
        );
        return;
      }
      res.redirect('/?msg=User ' + req.body.name + ' was created');
      return;
    }
  );
});

module.exports = router;
