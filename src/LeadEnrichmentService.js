'use strict';

var request = require('request');

class LeadEnrichmentService {

    constructor() {
        this.enrichmentServicesReady = [];
    }

    /*---------------- SERVICES ----------------*/

    enrichByQcnpjCrawler(item) {
        var instance = this;
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
                                instance.classifyIfAllServicesAreReady('enrichByQcnpjCrawler', id);
                            } else if((this._cnpj == null || this._cnpj == undefined) && info.cnpj) {
                                new LeadEnrichmentService().updateEnrichAttempts('enrichByQcnpjCrawler', id, true);
                                instance.classifyIfAllServicesAreReady('enrichByQcnpjCrawler', id);
                                item.lead.cnpj = info.cnpj;
                                new LeadEnrichmentService().enrichByReceitaWS(item);
                            }
                        }
                    );
                } else {
                    var attempts = (item.lead.enrichByQcnpjCrawler ? (item.lead.enrichByQcnpjCrawler+1): 1);
                    new LeadEnrichmentService().updateEnrichAttempts('enrichByQcnpjCrawler', id, attempts);
                    instance.classifyIfAllServicesAreReady('enrichByQcnpjCrawler', id);
                }
            });
        } else {
            var attempts = (item.lead.enrichByQcnpjCrawler ? (item.lead.enrichByQcnpjCrawler+1): 1);
            new LeadEnrichmentService().updateEnrichAttempts('enrichByQcnpjCrawler', id, attempts);
            instance.classifyIfAllServicesAreReady('enrichByQcnpjCrawler', id);
        }
    }

    enrichByReceitaWS(item) {
        var instance = this;
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
                                instance.classifyIfAllServicesAreReady('enrichByReceitaWS', id);
                                return callback(response.statusCode);
                            } else {
                                new LeadEnrichmentService().updateEnrichAttempts('enrichByReceitaWS', id, true);
                                instance.classifyIfAllServicesAreReady('enrichByReceitaWS', id);
                            }
                        }
                    );
                } else {
                    var attempts = (item.lead.enrichByReceitaWS ? (item.lead.enrichByReceitaWS+1): 1);
                    new LeadEnrichmentService().updateEnrichAttempts('enrichByReceitaWS', id, attempts);
                    instance.classifyIfAllServicesAreReady('enrichByReceitaWS', id);
                }
            });
        } else {
            var attempts = (item.lead.enrichByReceitaWS ? (item.lead.enrichByReceitaWS+1): 1);
            new LeadEnrichmentService().updateEnrichAttempts('enrichByReceitaWS', id, attempts);
            instance.classifyIfAllServicesAreReady('enrichByReceitaWS', id);
        }
    }

    /*---------------- UTILS ----------------*/

    classifyIfAllServicesAreReady(service_name, lead_id) {
        this.enrichmentServicesReady.push(service_name);
        console.log(this.enrichmentServicesReady);
        if (this.enrichmentServicesReady.indexOf('enrichByQcnpjCrawler') != -1 && this.enrichmentServicesReady.indexOf('enrichByReceitaWS') != -1) {
            request.post('https://intellead-classification.herokuapp.com/lead_status_by_id/'+lead_id);
        }
    }

    enrichLeadWithAllServices(lead_id, company, cnpj, callback){
        var item = {
            '_id': lead_id,
            'lead' : {
                'company': company,
                'cnpj': cnpj
            }
        };
        if (cnpj) {
            this.enrichByReceitaWS(item);
        }
        if (company) {
            this.enrichByQcnpjCrawler(item);
        }
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
