'use strict';

var request = require('request');

class LeadEnrichmentService {

    constructor(lead_id) {
        request.post(
            'https://rdstation-webhook.herokuapp.com/lead-info',
            { json: { lead_id: lead_id } },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body)
                }
            }
        );
        this.email = "";
        this.name = "";
        this.company = "";
        this.cnpj = "";
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
        if (this.cnpj) {
            var queryReceitaws = 'https://receitaws-data.herokuapp.com/?cnpj='+this.cnpj;
            request(queryReceitaws, function (error, response, body) {
                console.log("request");
                if (!error && response.statusCode == 200) {
                    var info = JSON.parse(body);
                    console.log(info);
                    return info;
                    //ADD data to our database
                }
            });
        }
    }

}
module.exports = LeadEnrichmentService;