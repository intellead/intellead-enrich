/*
 *
 * Copyright 2017 Softplan
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/

var sinon = require('sinon');
var proxyquire = require('proxyquire');
var chai = require('chai');
var expect = chai.expect;
var json = require('./test.json');

describe('service', function() {

    this.timeout(15000);

    var response = {
        'statusCode': 200
    };
    var body = JSON.stringify({});

    var LeadEnrichmentService;
    var request_stub;

    beforeEach(function () {
        request_stub = sinon.stub();
        LeadEnrichmentService = proxyquire('../src/LeadEnrichmentService', {'request': request_stub});
        LeadEnrichmentService.prototype.token = '1';
    });

    it('should return status code 200 when lead was informed', function(done) {
        request_stub.withArgs(json.expectedEndpointReceitaws).yields(null, response, body);
        request_stub.withArgs(json.expectedEndpointQcnpj).yields(null, response, body);
        LeadEnrichmentService.prototype.enrichLeadWithAllServices('1', 'intellead', '12345678', function(status_code) {
            expect(status_code).to.equal(200);
            expect(request_stub.getCall(0).args[0].url).to.equal(json.expectedEndpointReceitaws.url);
            expect(request_stub.getCall(1).args[0].json.rich_information, undefined);
            expect(request_stub.getCall(2).args[0].url).to.equal(json.expectedEndpointQcnpj.url);
            expect(request_stub.getCall(3).args[0].json.rich_information, undefined);
            done();
        });
    });

    it('should call qcnpj once when company was informed alone', function(done) {
        request_stub.withArgs(json.expectedEndpointQcnpj).yields(null, response, body);
        LeadEnrichmentService.prototype.enrichLeadWithAllServices(null, 'intellead', null, function(status_code) {
            expect(status_code).to.equal(200);
            expect(request_stub.getCall(0).args[0].json.attempts.enrichByReceitaWS).to.equal(1);
            expect(request_stub.getCall(1).args[0].url).to.equal(json.expectedEndpointQcnpj.url);
            expect(request_stub.getCall(2).args[0].json.rich_information, undefined);
            done();
        });
    });

    it('should call receitaws once when cnpj was informed alone', function(done) {
        request_stub.withArgs(json.expectedEndpointReceitaws).yields(null, response, body);
        LeadEnrichmentService.prototype.enrichLeadWithAllServices(null, null, '12345678', function(status_code) {
            expect(status_code).to.equal(200);
            expect(request_stub.getCall(0).args[0].url).to.equal(json.expectedEndpointReceitaws.url);
            expect(request_stub.getCall(1).args[0].json.rich_information, undefined);
            expect(request_stub.getCall(2).args[0].json.attempts.enrichByQcnpjCrawler).to.equal(1);
            done();
        });
    });

});
