const fs = require('fs');
const JSON5 = require('json5');
const axios = require('axios');
var tv4 = require('tv4');
const assert = require('assert');

let folders = fs.readdirSync('./sandbox');
let allFileTests = [];
let allFileSchemas = [];

for (i=0; i < folders.length; ++i) {
    
    let files = fs.readdirSync(`./sandbox/${folders[i]}`);
    
    for (j=0; j < files.length-1; ++j) {
        allFileTests.push(`./sandbox/${folders[i]}/${files[j]}`)
        allFileSchemas.push(`./sandbox/${folders[i]}/schemas/${files[j]}on`)
    }
    
}

async function createJsonSchemaForTest(allFileTests, allFileSchemas) {
    for (k=0; k < allFileTests.length; ++k) {

        try {
            currentTest = fs.readFileSync(allFileTests[k], "utf8")
        }
        catch (err) {
            console.error(err)
        }
        
        reguestData = currentTest.match(/(requestData =)\s+(.*)\s+const/s)[2]
        axiosOptionsForBook = JSON5.parse(reguestData);
        axiosOptionsForBook['baseURL'] = 'https://petstore.swagger.io/v2'
        axiosOptionsForBook['timeout'] = '20000'
        
        
        responseFromBook = await axios.request(axiosOptionsForBook)
        
        let docString = JSON.stringify(responseFromBook.data);
        console.log(docString)
        
        const optionsForJsonSchema = {
            method: 'POST',
            url: 'https://zup.jsonschema.net/v1/make-schema',
            headers: {Authorization: 'Bearer zpka_0d06a48e1150418aacdc83120bfb7b7b_3ec6e55a'},
            data: {
                document: docString,
                examplesRule: 'EXAMPLES_RULE_FULL',
                baseUri: "http://example.com/example.json",
                keywords: [
                    "KEYWORD_SCHEMA",
                    "KEYWORD_ID",
                    "KEYWORD_TYPE",
                    "KEYWORD_DEFAULT",
                    "KEYWORD_TITLE",
                    "KEYWORD_REQUIRED",
                    "KEYWORD_PROPERTIES",
                    "KEYWORD_EXAMPLES"
                ]
            }
        };

        await axios.request(optionsForJsonSchema).then(function (response) {
            
            fs.writeFile(allFileSchemas[k], JSON.stringify(JSON.parse(response.data.schema), null, 4), (err) => {
                if(err) throw err;
            });
            
            assert(tv4.validate(responseFromBook.data, response.data.schema), false, allFileSchemas[k] + ' - не ОК!!')

        }).catch(function (result) {
            console.error(result.response.data);
        });
         
    }
}


createJsonSchemaForTest(allFileTests, allFileSchemas)
