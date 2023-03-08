const { I } = inject();
const assert = require('assert');
const axios = require('axios');
        
Feature('Проверка /user - Create user');
        
Scenario('POST /user', async ({ I }) => {
            
    requestData = {
        method: 'post',
        url: '/user',
        params: {},
        data: {
            "id": 10000,
            "username": "pettstore",
            "firstName": "Василий",
            "lastName": "Юркин",
            "email": "vas@mail.ru",
            "password": "123123",
            "phone": "+799999999999",
            "userStatus": 1
          }
    }
    
    const expectedResult = {
        expectedStatus: 200,
        expectedSchema: require('./schemas/POST.user.json'),
        expectedSuccess: true
    }

    let checkResult = await I.checkApiResponse(requestData, expectedResult)
    assert.equal(checkResult, true, checkResult) 

}).retry(1);