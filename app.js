var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var router = express.Router();
var app = express();
var request = require('request');
var LeadEnrichmentService = require('./src/LeadEnrichmentService');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
    next();
});

app.use('/', router);

// Route that receives a POST request to lead-enrichment/
app.post('/lead-enrichment', function (req, res) {
    var lead_id = req.body.lead_id;
    request.post(
        'https://rdstation-webhook.herokuapp.com/lead-info',
        { json: { lead_id: lead_id } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var email = body.lead.email;
                var name = body.lead.name;
                var company = body.lead.company;
                var cnpj;//body.cnpj;
                var service = new LeadEnrichmentService(lead_id, email, name, company, cnpj);
                service.enrich(function(result) {
                    res.status(200).send(result);
                });
            }
        }
    );
});

router.get('/lead-enrichment', function(req, res, next) {
    res.sendStatus(200);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
