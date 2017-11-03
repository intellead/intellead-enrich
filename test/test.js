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

var server = require('../bin/www');
var expect = require('chai').expect;
var request = require('supertest');
var sinon = require('sinon');
var proxyquire = require('proxyquire');

describe('/', function() {

    var request_stub;
    var LeadEnrichmentService;
    before(function () {
        request_stub = sinon.stub();
        LeadEnrichmentService = proxyquire('../src/LeadEnrichmentService', {'request': request_stub});
    });

    after(function () {
        server.close();
    });

    it('should return status code 422 when lead was not informed', function(done) {
        request(server)
            .post('/lead-enrichment')
            .end(function(err, res) {
                expect(res.statusCode).to.equal(422);
                done();
            });
    });

    it('should return status code 200 when lead was informed', function(done) {
        var expectedEndpointQcnpj = 'http://qcnpj-crawler:3000/?companyName=intellead';
        var expectedEndpointReceitaws = 'http://receitaws-data:3000/?cnpj=12345678';
        var expectedEndpointDataAttempts = 'http://intellead-data:3000/update-enrich-attempts';
        var expectedEndpointClassification = 'http://intellead-classification:5000/lead_status_by_id/1';
        var expectedEndpointDataLeadInfo = {
            uri: 'http://intellead-data:3000/update-enriched-lead-information',
            method: 'POST',
            headers: { json: { lead_id: "1", rich_information: {} } }
        };
        var response = {
            'statusCode': 200
        };
        var body = JSON.stringify({});
        request_stub.withArgs(expectedEndpointQcnpj).yields(null, response, body);
        request_stub.withArgs(expectedEndpointReceitaws).yields(null, response, body);
        request_stub.withArgs(expectedEndpointDataLeadInfo).yields(null, response, null);
        request_stub.withArgs(expectedEndpointDataAttempts).yields(null, null, null);
        request_stub.withArgs(expectedEndpointClassification);
        LeadEnrichmentService.prototype.enrichLeadWithAllServices('1', 'intellead', '12345678', function(status_code) {
            expect(status_code).to.equal(200);
            done();
        });
    });

});
