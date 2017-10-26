'use strict';

var request = require('request');
var qcnpjCrawlerUrl = process.env.QCNPJ_CRAWLER_URL || 'http://qcnpj-crawler:3000';
var receitawsDataUrl = process.env.RECEITAWS_DATA_URL || 'http://receitaws-data:3000';
var dataUpdateEnrichedLeadInfoUrl = process.env.DATA_UPDATE_ENRICHED_LEAD_INFO_URL || 'http://intellead-data:3000/update-enriched-lead-information';
var dataUpdateEnrichAttempsUrl = process.env.DATA_UPDATE_ENRICH_ATTEMPTS_URL || 'http://intellead-data:3000/update-enrich-attempts';
var classificationUrl = process.env.CLASSIFICATION_URL || 'http://intellead-classification:5000/lead_status_by_id';

class LeadEnrichmentService {

    constructor() {
        this.enrichmentServicesReady = [];
    }

    enrichByQcnpjCrawler(item) {
        var that = this;
        var id = item._id;
        var company_name = item.lead.company;
        if (company_name) {
            var queryQcnpjCrawler = qcnpjCrawlerUrl + '/?companyName='+company_name;
            request(queryQcnpjCrawler, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var info = JSON.parse(body);
                    var options = {
                        uri: dataUpdateEnrichedLeadInfoUrl,
                        method: 'POST',
                        json: { lead_id: id, rich_information: info }
                    };
                    request(options, function(error, response, body){
                            if (error) {
                                console.log(error);
                                that.classifyIfAllServicesAreReady('enrichByQcnpjCrawler', id);
                            } else {
                                that.updateEnrichAttempts('enrichByQcnpjCrawler', id, true);
                                that.classifyIfAllServicesAreReady('enrichByQcnpjCrawler', id);
                            }
                        }
                    );
                } else {
                    var attempts = (item.lead.enrichByQcnpjCrawler ? (item.lead.enrichByQcnpjCrawler+1): 1);
                    that.updateEnrichAttempts('enrichByQcnpjCrawler', id, attempts);
                    that.classifyIfAllServicesAreReady('enrichByQcnpjCrawler', id);
                }
            });
        } else {
            var attempts = (item.lead.enrichByQcnpjCrawler ? (item.lead.enrichByQcnpjCrawler+1): 1);
            that.updateEnrichAttempts('enrichByQcnpjCrawler', id, attempts);
            that.classifyIfAllServicesAreReady('enrichByQcnpjCrawler', id);
        }
    }

    enrichByReceitaWS(item, callback) {
        var that = this;
        var id = item._id;
        if (item.lead && item.lead.cnpj) {
            var queryReceitaws = receitawsDataUrl + '/?cnpj='+item.lead.cnpj;
            request(queryReceitaws, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var info = JSON.parse(body);
                    var options = {
                        uri: dataUpdateEnrichedLeadInfoUrl,
                        method: 'POST',
                        json: { lead_id: id, rich_information: info }
                    };
                    request(options, function(error, response, body){
                            if (error) {
                                console.log(error);
                                that.classifyIfAllServicesAreReady('enrichByReceitaWS', id);
                                return callback(response.statusCode);
                            } else {
                                that.updateEnrichAttempts('enrichByReceitaWS', id, true);
                                that.classifyIfAllServicesAreReady('enrichByReceitaWS', id);
                            }
                        }
                    );
                } else {
                    var attempts = (item.lead.enrichByReceitaWS ? (item.lead.enrichByReceitaWS+1): 1);
                    that.updateEnrichAttempts('enrichByReceitaWS', id, attempts);
                    that.classifyIfAllServicesAreReady('enrichByReceitaWS', id);
                }
            });
        } else {
            var attempts = (item.lead.enrichByReceitaWS ? (item.lead.enrichByReceitaWS+1): 1);
            that.updateEnrichAttempts('enrichByReceitaWS', id, attempts);
            that.classifyIfAllServicesAreReady('enrichByReceitaWS', id);
        }
    }

    classifyIfAllServicesAreReady(service_name, lead_id) {
        if (this.enrichmentServicesReady == undefined) {
            this.enrichmentServicesReady = [];
        }
        this.enrichmentServicesReady.push(service_name);
        if (this.enrichmentServicesReady.indexOf('enrichByQcnpjCrawler') != -1 && this.enrichmentServicesReady.indexOf('enrichByReceitaWS') != -1) {
            request(classificationUrl + '/' + lead_id);
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
        this.enrichByReceitaWS(item);
        this.enrichByQcnpjCrawler(item);
        return callback(200);
    }

    updateEnrichAttempts(serviceName, lead_id, attempts) {
        var qtEnrichmentAttempts = {
            [serviceName] : attempts
        };
        var options = {
            uri: dataUpdateEnrichAttempsUrl,
            method: 'POST',
            json: { lead_id: lead_id, attempts: qtEnrichmentAttempts }
        };
        request(options, function(error, response, body){
                if (error) {
                    console.log(error);
                }
            }
        );
    }

}
module.exports = LeadEnrichmentService;
