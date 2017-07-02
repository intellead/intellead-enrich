'use strict';

var request = require('request');

class LeadEnrichmentService {

    constructor(email, name, company, cnpj) {
        this._email = email;
        this._name = name;
        this._company = company;
        this._cnpj = cnpj;
    }

    enrich(result){
        if (this._email) {

        }
        if (this._name) {

        }
        if (this._company) {

        }
        return result(this.enrichByReceitaWS());
    }

    enrichByReceitaWS() {
        console.log("_CNPJ: "+this._cnpj);
        if (this._cnpj) {
            var queryReceitaws = 'https://receitaws-data.herokuapp.com/?cnpj='+this._cnpj;
            request(queryReceitaws, function (error, response, body) {
                console.log("REQUEST");
                if (!error && response.statusCode == 200) {
                    console.log("body: " + body);
                    var info = JSON.parse(body);
                    console.log("info: " + info);
                    return info;
                    //ADD data to our database
                }
            });
        }
    }

}
module.exports = LeadEnrichmentService;