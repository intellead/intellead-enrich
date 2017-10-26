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