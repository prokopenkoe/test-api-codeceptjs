const { I } = inject();
const assert = require('assert');
const axios = require('axios');
        
Feature('Проверка /user/login - Logs user into the system');
        
Scenario('GET /user/login', async ({ I }) => {
            
    requestData = {
        method: 'get',
        url: '/user/login',
        params: {
            'username': 'pettstore',
            'password': '123123'},
        data: {}
    }
    
    const expectedResult = {
        expectedStatus: 200,
        expectedSchema: require('./schemas/GET.user-login.json'),
        expectedSuccess: true
    }

    let checkResult = await I.checkApiResponse(requestData, expectedResult)
    assert.equal(checkResult, true, checkResult) 

}).retry(1);