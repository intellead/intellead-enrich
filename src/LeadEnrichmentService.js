'use strict';

var request = require('request');

class LeadEnrichmentService {

    constructor(lead_id) {
        request.post(
            'https://rdstation-webhook.herokuapp.com/lead-info',
            { json: { lead_id: lead_id } },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    this._email = body.email;
                    this._name = body.name;
                    this._company = body.company;
                    this._cnpj = "04.724.734/0001-74";
                }
            }
        );

    }

    enrich(result){
        console.log("enrich");
        if (this.email) {

        }
        if (this.name) {

        }
        if (this.company) {

        }
        return result(this.enrichByReceitaWS());
    }

    enrichByReceitaWS() {
        console.log("enrichByReceitaWS");
        console.log("_CNPJ: "+this._cnpj);
        if (this._cnpj) {
            var queryReceitaws = 'https://receitaws-data.herokuapp.com/?cnpj='+this.cnpj;
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