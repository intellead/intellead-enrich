var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = express.Router();
var app = express();
var LeadEnrichmentService = require('./src/LeadEnrichmentService');

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

app.post('/lead-enrichment', function (req, res) {
    var lead = req.body.lead;
    if (!lead) {
        return res.sendStatus(422);
    }
    var lead_id = lead._id;
    var company = lead.company;
    var cnpj = lead.cnpj;
    new LeadEnrichmentService().enrichLeadWithAllServices(lead_id, company, cnpj, function(result) {
        res.sendStatus(result);
    });
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

  // router the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
