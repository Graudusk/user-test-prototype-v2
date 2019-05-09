const express = require('express');
const app = express();
const port = 1224;
const path = require('path');
const ejs = require('ejs');
const routeNews = require('./routes/news.js');
const routeLogin = require('./routes/login.js');
const routes = require('./routes/routes.js');
const middleware = require('./middleware/index.js');
const session = require('express-session');
const serve = express.static(__dirname + '/public');
const cors = require('cors');
const morgan = require('morgan');
app.use(serve);

app.use(cors());

app.use(
  session({
    secret: 'Jg832gkgEGWHs90fm!=)rawrgGEmglev09w33oirnf0sdfmPOAEFLGEG',
    resave: true,
    saveUninitialized: true,
  })
);
app.use('/', routes);
app.use('/login', routeLogin);
app.use('/news', middleware.auth, routeNews, serve);

// app.use('*', express.static('views'));
app.set('view engine', 'ejs');

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// don't show the log when it is test
// if (process.env.NODE_ENV !== 'test') {
// use morgan to log at command line
app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
// }
