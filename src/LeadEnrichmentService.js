'use strict';

var request = require('request');
class LeadEnrichmentService {

    constructor(lead_id, email, name, company, cnpj) {
        this._lead_id = lead_id;
        this._email = email;
        this._name = name;
        this._company = company;
        this._cnpj = cnpj;
    }

    enrich(callback){
        this.enrichByQcnpjCrawler(function(result) {
            return callback(result);
        });

        this.enrichByReceitaWS(function(result) {
            return callback(result);
        });
    }

    enrichByQcnpjCrawler(callback) {
        var id = this._lead_id;
        if (this._company) {
            var queryQcnpjCrawler = 'https://qcnpj-crawler.herokuapp.com/?companyName='+this._company;
            request(queryQcnpjCrawler, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var info = JSON.parse(body);
                    request.post(
                        'https://rdstation-webhook.herokuapp.com/update-enriched-lead-information',
                        { json: { lead_id: id, rich_information: info } },
                        function (error, response, body) {
                            return callback(response.statusCode);
                        }
                    );
                }
            });
        }
    }

    enrichByReceitaWS(callback) {
        var id = this._lead_id;
        console.log("CNPJ: "+this._cnpj);
        if (this._cnpj) {
            var queryReceitaws = 'https://receitaws-data.herokuapp.com/?cnpj='+this._cnpj;
            console.log("here");
            console.log(queryReceitaws);
            request(queryReceitaws, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log("here2");
                    var info = JSON.parse(body);
                    console.log(info);
                    request.post(
                        'https://rdstation-webhook.herokuapp.com/update-enriched-lead-information',
                        { json: { lead_id: id, rich_information: info } },
                        function (error, response, body) {
                            return callback(response.statusCode);
                        }
                    );
                }
            });
        }
    }

}
module.exports = LeadEnrichmentService;