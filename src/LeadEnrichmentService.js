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
        this.enrichByQcnpjCrawler(this._lead_id, this._company);
        this.enrichByReceitaWS(this._lead_id, this._cnpj);
        return callback(200);
    }

    enrichByQcnpjCrawler(id, company_name) {
        if (company_name) {
            var queryQcnpjCrawler = 'https://qcnpj-crawler.herokuapp.com/?companyName='+company_name;
            request(queryQcnpjCrawler, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var info = JSON.parse(body);
                    request.post(
                        'https://rdstation-webhook.herokuapp.com/update-enriched-lead-information',
                        { json: { lead_id: id, rich_information: info } },
                        function (error, response, body) {
                            if (error) {
                                console.log(error);
                            } else if((this._cnpj == null || this._cnpj == undefined) && info.cnpj) {
                                new LeadEnrichmentService().enrichByReceitaWS(id, info.cnpj);
                             }
                        }
                    );
                }
            });
        }
    }

    enrichByReceitaWS(id, cnpj) {
        if (cnpj) {
            var queryReceitaws = 'https://receitaws-data.herokuapp.com/?cnpj='+cnpj;
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