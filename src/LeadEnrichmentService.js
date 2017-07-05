'use strict';

var request = require('request');

class LeadEnrichmentService {

    constructor(lead_id, email, name, company, cnpj) {
        console.log("Constructor: " + lead_id);
        this._id = lead_id;
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
        if (this._company) {
            var queryQcnpjCrawler = 'https://qcnpj-crawler.herokuapp.com/?companyName='+this._company;
            request(queryQcnpjCrawler, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var info = JSON.parse(body);
                    console.log(info);
                    console.log("this._id: " + this._id);
                    var data = '?lead_id='+this._id+'&rich_information='+info;
                    console.log(data);
                    request('https://rdstation-webhook.herokuapp.com/update-enriched-lead-information'+data, function (error, response, body) {
                        console.log("STATUS:"+response.statusCode);
                        return callback(response.statusCode);
                    });
                }
            });
        }
    }

    enrichByReceitaWS(callback) {
        if (this._cnpj) {
            var queryReceitaws = 'https://receitaws-data.herokuapp.com/?cnpj='+this._cnpj;
            request(queryReceitaws, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var info = JSON.parse(body);
                    return callback(info);
                    //ADD data to our database
                }
            });
        }
    }

}
module.exports = LeadEnrichmentService;