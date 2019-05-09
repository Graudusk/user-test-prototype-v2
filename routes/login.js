var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const login = require('../models/login');
const db = require('../db/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/
router.get('/', (req, res) => {
  let data = {
    title: 'Login',
    error: req.query.error,
    msg: req.query.msg,
  };

  console.log(req.query.error);

  res.render('login', {
    data: data,
    page: req.url,
    user: req.session.name || null,
  });
});

router.get('/logout', (req, res) => {
  console.info(`Successful logout, deleting session`);

  db.run(
    `INSERT INTO sessions (type, email, date, user_agent) values('LOGOUT', ?, ?, ?);`,
    [req.session.email, new Date().toUTCString(), req.get('User-Agent')],
    (err, row) => {
      console.log(err);
    }
  );
  req.session.destroy();
  res.redirect('/');
});

router.post('/', urlencodedParser, async (req, res) => {
  console.log('login post');

  let sql = `SELECT email, id, name FROM users WHERE email = ? AND password = ?;`;
  db.get(sql, [req.body.email, req.body.password], (err, row) => {
    if (err) {
      console.log({
        errors: {
          status: 500,
          source: '/login',
          title: 'Database error',
          detail: err.message,
        },
      });
      res.redirect('?error=Password or Email is incorrect');
    }
    if (row) {
      if (row && row.email) {
        console.info(`Successful login, setting user ${row.email} in session.`);
        req.session.email = row.email;
        req.session.name = row.name;
        req.session.id = row.id;
        req.session.save();

        db.run(
          `INSERT INTO sessions (type, email, date, user_agent) values('LOGIN', ?, ?, ?);`,
          [req.body.email, new Date().toUTCString(), req.get('User-Agent')],
          (err, row) => {
            console.log(err);
          }
        );

        res.redirect('/');
      } else {
        console.log({
          errors: {
            status: 401,
            source: '/login',
            title: 'Wrong password',
            detail: 'Password or Email is incorrect.',
          },
        });
        res.redirect('?error=Password is incorrect');
      }
    } else {
      res.redirect('?error=Password or Email is incorrect');
    }
  });
});

// router.use('/', express.static(__dirname + '/public'));

module.exports = router;
