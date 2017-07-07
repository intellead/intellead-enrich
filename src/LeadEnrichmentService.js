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
        this.enrichByQcnpjCrawler();
        this.enrichByReceitaWS();
        return callback(200);
    }

    enrichByQcnpjCrawler() {
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
                            if (error) {
                                console.log(error);
                            }
                            console.log("body: " + body);
                            console.log("response: " + response);
                            // else if((this._cnpj == null || this._cnpj == undefined) && body.company.cnpj) {
                            //     this._cnpj = body.company.cnpj;
                            //     this.enrichByReceitaWS();
                            // }
                        }
                    );
                }
            });
        }
    }

    enrichByReceitaWS() {
        var id = this._lead_id;
        if (this._cnpj) {
            var queryReceitaws = 'https://receitaws-data.herokuapp.com/?cnpj='+this._cnpj;
            request(queryReceitaws, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var info = JSON.parse(body);
                    request.post(
                        'https://rdstation-webhook.herokuapp.com/update-enriched-lead-information',
                        { json: { lead_id: id, rich_information: info } },
                        function (error, response, body) {
                            if (error) {
                                console.log(error);
                            }
                        }
                    );
                }
            });
        }
    }

}
module.exports = LeadEnrichmentService;