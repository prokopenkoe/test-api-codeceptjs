const { I } = inject();
const assert = require('assert');
const axios = require('axios');
        
Feature('Проверка /pet/findByStatus - Finds Pets by status');
        
Scenario('GET /pet/findByStatus', async ({ I }) => {
            
    requestData = {
        method: 'get',
        url: '/pet/findByStatus',
        params: {
            "status": "available"
        },
        data: {}
    }
    
    const expectedResult = {
        expectedStatus: 201,
        expectedSchema: require('./schemas/GET pet-findByStatus.json'),
        expectedSuccess: true
    }

    let checkResult = await I.checkApiResponse(requestData, expectedResult)
    assert.equal(checkResult, true, checkResult) 

}).retry(1);