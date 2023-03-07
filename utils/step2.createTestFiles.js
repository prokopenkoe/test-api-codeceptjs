var fs = require('fs');
const ExcelJS = require('exceljs');

// Создает директорию, если такая не существует
async function createFolderHandler(folderName){
    
    try {
        if (!fs.existsSync(folderName)){
            fs.mkdirSync(folderName)
        }
    } catch (err) {
        console.error(err)
    }
    
}

// Создает файл в заданном месте и с заданным именем 
async function createFileHandler(folderName, fileName){
    
    fs.open(`${folderName}/${fileName}`, 'w', (err) => {
        if(err) throw err;
        console.log(`File '${fileName}' created`);
    });
    
}

var workbook = new ExcelJS.Workbook();

workbook.xlsx.readFile('./allapi_sandbox.xlsx').then(() => {
    
    const worksheet = workbook.getWorksheet('My Sheet');

    const c1 = worksheet.getColumn(1);
    var rowCount=0
    c1.eachCell(c => {
        rowCount = rowCount + 1;
    });

    for (i = 2; i < rowCount+1; ++i) {
    
        let row = worksheet.getRow(i);
        folderName = './sandbox/' + row.getCell(1).value;
        methodApi = row.getCell(2).value.toString();
        nameApi = row.getCell(3).value.toString();
        descriptionApi = row.getCell(4).value;
        folderNameSchemas = folderName + '/schemas';
        
        nameApiValid = nameApi.replace(/^\//g, '').replace(/\/$/g, '').replace(/[\{\}]/g, '').replace(/[\/]/g, '-');
        
        createFolderHandler(folderName);
        createFolderHandler(folderNameSchemas);

        createFileHandler(folderName, `${methodApi}.${nameApiValid}.js`);
        createFileHandler(folderNameSchemas, `${methodApi}.${nameApiValid}.json`);

        let fullPathToTestFile = `${folderName}/${methodApi}.${nameApiValid}.js`
        let methodApiLowerCase = methodApi.toLowerCase()
        let testText = `const { I } = inject();
const assert = require('assert');
const axios = require('axios');
        
Feature('Проверка ${nameApi} - ${descriptionApi}');
        
Scenario('${methodApi} ${nameApi}', async ({ I }) => {
            
    requestData = {
        method: '${methodApiLowerCase}',
        url: '${nameApi}',
        params: {},
        data: {}
    }
    
    const expectedResult = {
        expectedStatus: 200,
        expectedSchema: require('./schemas/${methodApi}.${nameApiValid}.json'),
        expectedSuccess: true
    }

    let checkResult = await I.checkApiResponse(requestData, expectedResult)
    assert.equal(checkResult, true, checkResult) 

}).retry(1);`





        fs.writeFile(fullPathToTestFile, testText, (err) => {
            if(err) throw err;
            console.log('Data has been write!');
        });

    }
    
    


    

}).catch(err => {
    console.log(err.message);
});


