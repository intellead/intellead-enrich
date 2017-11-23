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
var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var request_stub = sinon.stub();
var app = proxyquire('../app', {'request': request_stub});
var request = supertest(app);

describe('/', function() {

    this.timeout(15000);

    var LeadEnrichmentService;
    before(function () {
        LeadEnrichmentService = proxyquire('../src/LeadEnrichmentService', {'request': request_stub});
    });

    it('should return status code 422 when lead was not informed', function(done) {
        request_stub.withArgs({url: 'http://intellead-security:8080/auth/1'}).yields(null, {'statusCode': 200}, null);
        request
            .post('/lead-enrichment')
            .set('token', '1')
            .expect(422)
            .end(function(err, res) {
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

    it('should return status code 403', function(done) {
        request_stub.withArgs({url: 'http://intellead-security:8080/auth/1'}).yields(null, {'statusCode': 403}, null);
        request.get('/lead-enrichment')
            .set('token', '1')
            .expect(403)
            .end(function(err, res) {
                done();
            });
    });

});
