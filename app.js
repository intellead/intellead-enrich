var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var router = express.Router();
var app = express();
var schedule = require('node-schedule');
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

var enrichment_services = ['enrichByQcnpjCrawler', 'enrichByReceitaWS'];

var enrich_each_5_minutes = schedule.scheduleJob('*/1 * * * *', function(){
    console.log('intellead-enrich auto Started...');
    for (var index in enrichment_services) {
        var enrichment_method = enrichment_services[index];
        request.get(
            'https://intellead-data.herokuapp.com/lead-to-enrich',
            { json: { enrichService: enrichment_method } },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var itens = body;
                    for (var index in itens) {
                        var item = itens[index];
                        var service = new LeadEnrichmentService();
                        console.log('A');
                        console.log(enrichment_method);
                        service['enrichByQcnpjCrawler'](item._id, item.lead.company);
                        console.log('C');
                        //service.enrichByQcnpjCrawler(item._id, item.lead.company);
                    }
                }
                if (error || response.statusCode != 200) {
                    console.log('intellead-enrich auto Finished [ERROR]');
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(response);
                    }
                }
            }
        );
    }
    console.log('intellead-enrich auto Finished [OK]');
});

app.use('/', router);

// Route that receives a POST request to lead-enrichment/
app.post('/lead-enrichment', function (req, res) {
    var lead_id = req.body.lead_id;
    request.post(
        'https://intellead-data.herokuapp.com/lead-info',
        { json: { lead_id: lead_id } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var email = body.lead.email;
                var name = body.lead.name;
                var company = body.lead.company;
                var cnpj = body.lead.cnpj;
                var service = new LeadEnrichmentService(lead_id, email, name, company, cnpj);
                service.enrich(function(result) {
                    res.sendStatus(result);
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
