const ExcelJS = require('exceljs');


Feature('Парсер swagger');

Scenario('Парсер всех методов из сваггера', async({ I }) => {
    
    // Задаем параметры будущего Excel-файла, названия колонок и их размеры
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Sheet');
    worksheet.columns = [
        { header: 'directory', key: 'directory', width: 15 },
        { header: 'method', key: 'method', width: 10 },
        { header: 'api ', key: 'api', width: 40 },
        { header: 'Description', key: 'descr', width: 60 }
    ];

    I.amOnPage("https://petstore.swagger.io/");
    I.wait(5)

    // Получаем все методы в виде массива
    let allApiMethods =  await I.executeScript(function() {
        
        // Указываем локатор, подходящий для всех методов
        locator_allApiMethods = "span.opblock-summary-method"
        
        let apiMethods=[]; 
        const methods = Array.prototype.slice.call(document.querySelectorAll(locator_allApiMethods)); 
        for (let i=0; i<methods.length; ++i) {
            apiMethods[i]=methods[i].innerText}; 
            return apiMethods
        });
    
    // Получаем все названия методов в виде массива
    let allApiNames =  await I.executeScript(function() {
        
        // Указываем локатор, подходящий для всех названий методов
        locator_allApiNames = "button.opblock-summary-control > span:nth-child(2)"
        
        let Names=[]; 
        const paths = Array.prototype.slice.call(document.querySelectorAll(locator_allApiNames)); 
        for (let i=0; i<paths.length; ++i) {
            Names[i]=paths[i].innerText}; 
            return Names
        });
    
    // Получаем все описания методов в виде массива
    let allApiDescriptions = await I.executeScript(function() {
        
        // Указываем локатор, подходящий для всех описаний методов
        locator_allApiDescriptions = "div.opblock-summary-description"
        
        let Descriptions=[]; 
        const Descrs = Array.prototype.slice.call(document.querySelectorAll(locator_allApiDescriptions)); 
        for (let i=0; i<Descrs.length; ++i) {
            Descriptions[i]=Descrs[i].innerText}; 
            return Descriptions
        });
    
    // Соотносим между собой данные из всех трех предыдущих массивов, дописываем к ним директорию, в которой лежат методы
    // и сохраняем в виде таблицы
    for (let i=0; i<allApiNames.length; i++) {
        let apiDirectory = await I.grabTextFrom(`//a[contains(., "${allApiNames[i]}")]/../../../../../../../../h3/a/span`)
        worksheet.addRow({
            directory: apiDirectory, 
            method: allApiMethods[i], 
            api: allApiNames[i], 
            descr: allApiDescriptions[i]
        });
    }
    
    await workbook.xlsx.writeFile("allapi.xlsx");

});
