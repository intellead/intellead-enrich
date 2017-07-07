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
        this.enrichByReceitaWS(this._lead_id, this._cnpj);
        return callback(200);
    }

    enrichByQcnpjCrawler() {
        var id = this._lead_id;
        console.log("[enrichByQcnpjCrawler]Entrou no enrichByQcnpjCrawler");
        console.log("[enrichByQcnpjCrawler]ID: " + id);
        if (this._company) {
            var queryQcnpjCrawler = 'https://qcnpj-crawler.herokuapp.com/?companyName='+this._company;
            request(queryQcnpjCrawler, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var info = JSON.parse(body);
                    console.log("[enrichByQcnpjCrawler]Retornou uma resposta sem erro: "+ info);
                    request.post(
                        'https://rdstation-webhook.herokuapp.com/update-enriched-lead-information',
                        { json: { lead_id: id, rich_information: info } },
                        function (error, response, body) {
                            console.log("[enrichByQcnpjCrawler]Enviou para persistir os dados na base");
                            if (error) {
                                console.log(error);
                            } else if((this._cnpj == null || this._cnpj == undefined) && info.cnpj) {
                                console.log("[enrichByQcnpjCrawler]Não tem CNPJ na base, mas já recuperou o CNPJ por esse crawler: " + info.cnpj);
                                console.log("[enrichByQcnpjCrawler]Agora tem info.cnpj: " + info.cnpj);
                                new LeadEnrichmentService().enrichByReceitaWS(id, info.cnpj);
                             }
                        }
                    );
                }
            });
        }
    }

    enrichByReceitaWS(id, cnpj) {
        console.log("Entrou no enrichByReceitaWS");
        console.log("[enrichByReceitaWS]ID: " + id);
        console.log("[enrichByReceitaWS]_cnpj: " + cnpj);
        if (cnpj) {
            var queryReceitaws = 'https://receitaws-data.herokuapp.com/?cnpj='+cnpj;
            request(queryReceitaws, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var info = JSON.parse(body);
                    console.log("[enrichByReceitaWS]Retornou resposta sem erro: " + info);
                    request.post(
                        'https://rdstation-webhook.herokuapp.com/update-enriched-lead-information',
                        { json: { lead_id: id, rich_information: info } },
                        function (error, response, body) {
                            console.log("[enrichByReceitaWS]Enviou para persistir os dados na base");
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