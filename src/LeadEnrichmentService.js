'use strict';

var request = require('request');

class LeadEnrichmentService {

    constructor() {
    }

    /*---------------- SERVICES ----------------*/

    enrichByQcnpjCrawler(item) {
        var id = item._id;
        var company_name = item.lead.company;
        console.log("[enrichByQcnpjCrawler] LEAD_ID: " + id + " | COMPANY: " + company_name);
        if (company_name) {
            var queryQcnpjCrawler = 'https://qcnpj-crawler.herokuapp.com/?companyName='+company_name;
            request(queryQcnpjCrawler, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var info = JSON.parse(body);
                    request.post(
                        'https://intellead-data.herokuapp.com/update-enriched-lead-information',
                        { json: { lead_id: id, rich_information: info } },
                        function (error, response, body) {
                            if (error) {
                                console.log(error);
                            } else if((this._cnpj == null || this._cnpj == undefined) && info.cnpj) {
                                new LeadEnrichmentService().updateEnrichAttempts('enrichByQcnpjCrawler', id, true);
                                console.log('[enrichByQcnpjCrawler] Lead '+id+' enriched!');
                                item.lead.cnpj = info.cnpj;
                                new LeadEnrichmentService().enrichByReceitaWS(item);
                            }
                        }
                    );
                } else {
                    var attempts = (item.lead.enrichByQcnpjCrawler ? (item.lead.enrichByQcnpjCrawler+1): 1);
                    new LeadEnrichmentService().updateEnrichAttempts('enrichByQcnpjCrawler', id, attempts);
                }
            });
        } else {
            var attempts = (item.lead.enrichByQcnpjCrawler ? (item.lead.enrichByQcnpjCrawler+1): 1);
            new LeadEnrichmentService().updateEnrichAttempts('enrichByQcnpjCrawler', id, attempts);
        }
    }

    enrichByReceitaWS(item) {
        var id = item._id;
        if (item.lead && item.lead.cnpj) {
            var queryReceitaws = 'https://receitaws-data.herokuapp.com/?cnpj='+item.lead.cnpj;
            request(queryReceitaws, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var info = JSON.parse(body);
                    request.post(
                        'https://intellead-data.herokuapp.com/update-enriched-lead-information',
                        { json: { lead_id: id, rich_information: info } },
                        function (error, response, body) {
                            if (error) {
                                console.log(error);
                            } else {
                                new LeadEnrichmentService().updateEnrichAttempts('enrichByReceitaWS', id, true);
                                console.log('[enrichByReceitaWS] Lead '+id+' enriched!');
                            }
                        }
                    );
                } else {
                    var attempts = (item.lead.enrichByReceitaWS ? (item.lead.enrichByReceitaWS+1): 1);
                    new LeadEnrichmentService().updateEnrichAttempts('enrichByReceitaWS', id, attempts);
                }
            });
        } else {
            var attempts = (item.lead.enrichByReceitaWS ? (item.lead.enrichByReceitaWS+1): 1);
            new LeadEnrichmentService().updateEnrichAttempts('enrichByReceitaWS', id, attempts);
        }
    }

    /*---------------- UTILS ----------------*/

    enrichLeadWithAllServices(lead_id, company, cnpj, callback){
        console.log("[enrichLeadWithAllServices] LEAD_ID: " + lead_id + " | COMPANY: " + company + " | CNPJ: " + cnpj);
        var item = {
            '_id': lead_id,
            'lead' : {
                'company': company,
                'cnpj': cnpj
            }
        };
        console.log(item);
        this.enrichByQcnpjCrawler(item);
        this.enrichByReceitaWS(item);
        return callback(200);
    }

    updateEnrichAttempts(serviceName, lead_id, attemps) {
        var qtEnrichmentAttempts = {
            [serviceName] : attemps
        }
        request.post(
            'https://intellead-data.herokuapp.com/update-enrich-attempts',
            { json: { lead_id: lead_id, attempts: qtEnrichmentAttempts } },
            function (error, response, body) {
                if (error) {
                    console.log(error);
                }
            }
        );
    }


}
module.exports = LeadEnrichmentService;