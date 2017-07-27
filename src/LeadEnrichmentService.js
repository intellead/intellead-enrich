'use strict';

var request = require('request');

class LeadEnrichmentService {

    constructor() {
    }

    /*---------------- UTILS ----------------*/

    enrichLeadWithAllServices(lead_id, company, cnpj, callback){
        var item = {
            '_id': lead_id,
            'lead' : {
                'company': company,
                'cnpj': cnpj
            }
        }
        this.enrichByQcnpjCrawler(item);
        this.enrichByReceitaWS(item);
        return callback(200);
    }

    updateEnrichAttemps(serviceName, lead_id, attemps) {
        var qtEnrichmentAttempts = {
            [serviceName] : (attemps ? (attemps+1): 1)
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

    /*---------------- SERVICES ----------------*/

    enrichByQcnpjCrawler(item) {
        var id = item._id;
        var company_name = item.lead.company;
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
                                this.updateEnrichAttemps('enrichByQcnpjCrawler', id, true);
                                console.log('[enrichByQcnpjCrawler] Lead '+id+' enriched!');
                                item.lead.cnpj = info.cnpj;
                                new LeadEnrichmentService().enrichByReceitaWS(item);
                            }
                        }
                    );
                } else {
                    var attempts = (item.lead.enrichByQcnpjCrawler ? (item.lead.enrichByQcnpjCrawler+1): 1);
                    this.updateEnrichAttemps('enrichByQcnpjCrawler', id, attempts);
                }
            });
        } else {
            var attempts = (item.lead.enrichByQcnpjCrawler ? (item.lead.enrichByQcnpjCrawler+1): 1);
            this.updateEnrichAttemps('enrichByQcnpjCrawler', id, attempts);
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
                                this.updateEnrichAttemps('enrichByReceitaWS', id, true);
                                console.log('[enrichByReceitaWS] Lead '+id+' enriched!');
                            }
                        }
                    );
                } else {
                    var attempts = (item.lead.enrichByReceitaWS ? (item.lead.enrichByReceitaWS+1): 1);
                    this.updateEnrichAttemps('enrichByReceitaWS', id, attempts);
                }
            });
        } else {
            var attempts = (item.lead.enrichByReceitaWS ? (item.lead.enrichByReceitaWS+1): 1);
            this.updateEnrichAttemps('enrichByReceitaWS', id, attempts);
        }
    }




}
module.exports = LeadEnrichmentService;