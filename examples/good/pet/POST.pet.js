const { I } = inject();
const assert = require('assert');
const axios = require('axios');
        
Feature('Проверка /pet - Add a new pet to the store');
        
Scenario('POST /pet', async ({ I }) => {
            
    requestData = {
        method: 'post',
        url: '/pet',
        params: {},
        data: {
            "id": 0,
            "category": {
              "id": 0,
              "name": "string"
            },
            "name": "doggie",
            "photoUrls": [
              "string"
            ],
            "tags": [
              {
                "id": 0,
                "name": "string"
              }
            ],
            "status": "available"
        }
    }
    
    const expectedResult = {
        expectedStatus: 200,
        expectedSchema: require('./schemas/POST.pet.json'),
        expectedSuccess: true
    }

    let checkResult = await I.checkApiResponse(requestData, expectedResult)
    assert.equal(checkResult, true, checkResult) 

}).retry(1);