var express = require('express');
var router = express.Router();
const news = require('../models/news.js');
const db = require('../db/database');

router.get('/', async (req, res) => {
  let data = {
    title: 'News',
    user: req.session.name || null,
  };

  db.all(`SELECT * FROM articles ORDER BY date desc;`, (err, row) => {
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
    console.log(data);
    res.render('news', {
      data: data,
      page: req.url,
    });
  });
});

router.use('/', express.static(__dirname + '/../public'));

router.get('/:slug/', async (req, res) => {
  const slug = req.params.slug;
  let data = { title: 'Article', user: req.session.name || null };

  db.get(`SELECT * FROM articles WHERE slug = ?;`, [slug], (err, row) => {
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
    data.article = row;
    data.article.shortTitle = row.title.substr(0, 10);
    console.log(data);
    res.render('article', {
      data: data,
      page: req.url,
    });
  });
});

module.exports = router;
