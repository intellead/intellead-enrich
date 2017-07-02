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
        if (this._company) {

        }
        this.enrichByReceitaWS(function(result) {
            return callback(result);
        });
    }

    enrichByReceitaWS(callback) {
        if (this._cnpj) {
            var queryReceitaws = 'https://receitaws-data.herokuapp.com/?cnpj='+this._cnpj.toString();
            request(queryReceitaws, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log("body: " + body);
                    var info = JSON.parse(body);
                    console.log("info: " + info);
                    return callback(info);
                    //ADD data to our database
                }
            });
        }
    }

}
module.exports = LeadEnrichmentService;