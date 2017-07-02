'use strict';

var request = require('request');

class LeadEnrichmentService {

    constructor(lead_id, callback) {
        request.post(
            'https://rdstation-webhook.herokuapp.com/lead-info',
            { json: { lead_id: lead_id } },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    this.email = body.email;
                    this.name = body.name;
                    this.company = body.company;
                    this.cnpj = "04.724.734/0001-74";
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
        console.log("CNPJ: "+ this.cnpj);
        if (this.cnpj) {
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