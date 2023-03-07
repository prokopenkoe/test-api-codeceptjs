const { I } = inject();
const assert = require('assert');
const axios = require('axios');
        
Feature('Проверка /pet/{petId} - Find pet by ID');
        
Scenario('GET /pet/{petId}', async ({ I }) => {
            
    requestData = {
        method: 'get',
        url: '/pet/15555',
        params: {},
        data: {}
    }
    
    const expectedResult = {
        expectedStatus: 200,
        expectedSchema: require('./schemas/GET pet-petId.json'),
        expectedSuccess: true
    }

    let checkResult = await I.checkApiResponse(requestData, expectedResult)
    assert.equal(checkResult, true, checkResult) 

}).retry(1);