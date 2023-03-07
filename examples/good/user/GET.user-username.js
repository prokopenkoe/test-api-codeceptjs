const { I } = inject();
const assert = require('assert');
const axios = require('axios');
        
Feature('Проверка /user/{username} - Get user by user name');
        
Scenario('GET /user/{username}', async ({ I }) => {
            
    requestData = {
        method: 'get',
        url: '/user/pettstore',
        params: {},
        data: {}
    }
    
    const expectedResult = {
        expectedStatus: 200,
        expectedSchema: require('./schemas/GET.user-username.json'),
        expectedSuccess: true
    }

    let checkResult = await I.checkApiResponse(requestData, expectedResult)
    assert.equal(checkResult, true, checkResult) 

}).retry(1);