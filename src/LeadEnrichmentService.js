'use strict';

var request = require('request');

class LeadEnrichmentService {

    constructor(email, name, company, cnpj) {
        this._email = email;
        this._name = name;
        this._company = company;
        this._cnpj = cnpj;
    }

    enrich(callback){
        if (this._email) {

        }
        if (this._name) {

        }
        this.enrichByQcnpjCrawler(function(result) {
            return callback(result);
        });

        this.enrichByReceitaWS(function(result) {
            return callback(result);
        });
    }

    enrichByQcnpjCrawler(callback) {
        if (this._company) {
            var queryQcnpjCrawler = 'https://qcnpj-crawler.herokuapp.com/?nomeDaEmpresa='+this._company;
            request(queryQcnpjCrawler, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var info = JSON.parse(body);
                    return callback(info);
                    //ADD data to our database
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