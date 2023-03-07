const { I } = inject();
const assert = require('assert');
const axios = require('axios');
        
Feature('Проверка /pet - Update an existing pet');
        
Scenario('PUT /pet', async ({ I }) => {
            
    requestData = {
        method: 'put',
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
        expectedSchema: require('./schemas/PUT.pet.json'),
        expectedSuccess: true
    }

    let checkResult = await I.checkApiResponse(requestData, expectedResult)
    assert.equal(checkResult, true, checkResult) 

}).retry(1);