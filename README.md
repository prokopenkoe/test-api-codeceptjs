# CodeceptJS API testing

Помогает быстро написать автотесты api и автоматизировать их написание.
Фиксирует текущее состояние методов.

## Настройка

Основные настройки находятся в файле `codecept.conf.js`
* BaseUrl - основной URL проекта;
* tests - расположение запускаемых тестов
* include.API_TIMEOUT - настраиваемый таймаут для запросов
* include.API_HEADERS - дополнительные общие для всех запросов заголовки

Перед запуском необходимо также исправить файл `utils\step1.parseApiFromSwagger.js` 
* в 18 строке URL, по которому расположен SwaggerUI
`I.amOnPage("<your_swagger_url>");`

* и необходимо сверить локаторы для элементов (directory, method, api, description), посколько в разных сваггерах они могут отличаться:
```js
locator_allApiMethods = "span.opblock-summary-method"
locator_allApiNames = "button.opblock-summary-control > span:nth-child(2)"
locator_allApiDescriptions = "div.opblock-summary-description"
apiDirectory = await I.grabTextFrom(`//a[contains(., "${allApiNames[i]}")]/../../../../../../../../h3/a/span`)
```
Для проверки можно подставить вместо `${allApiNames[i]}` любое значение из `locator_allApiNames`. Должен указать директорию, в которой находится эндпойнт.

## Использование

После конфигурирования (либо оставив базовые настройки для проверки), пошагово выполнить команды:

### Шаг 1. 

Запускаем парсер, собирающий из Swagger UI в файл 
`npm run step1.parseSwagger`
В результате работы в корне появится файл allapi.xlsx, в котором будут собраны все методы проекта. 
Если имеются методы, помеченные deprecated, их необходимо сразу убрать из файла. 

### Шаг 2. 

Вторым этапом идет генерация файлов для всех методов.
Предварительно необходимо скопировать файл `allapi.xlsx` и переименовать его в `allapi_sandbox.xlsx`, а затем в нем оставить набор методов, для которых будут писаться тесты в текущую сессию. Если в проекте, например, 200+ методов, удобно разбивать на небольшие порции по 10 методов.

Генерация файлов запускается командой
`npm run step2.createTestFiles`
Команда прочитает `allapi_sandbox.xlsx` и для каждой строчки создаст файлы cогласно структуре

```
./sandbox/
├── folder1/
│   ├── test1.js
│   ├── test2.js
│   ├── schemas/
│   │   ├── schema1.json
│   │   ├── schema2.json
├── folder2/
│   ├── test3.js
│   ├── test4.js
│   ├── schemas/
│   │   ├── schema3.json
│   │   ├── schema4.json
```

В файлы с тестами сразу пишется шаблон теста, в который подставляются значения для каждого конкретного метода.

```js
Feature('Проверка /pet - Add a new pet to the store');

Scenario('POST /pet', async ({ I }) => {
            
    requestData = {
        method: 'post',
        url: '/pet',
        params: {},
        data: {}
    }
    
    const expectedResult = {
        expectedStatus: 200,
        expectedSchema: require('./schemas/POST.pet.json'),
        expectedSuccess: true
    }

    let checkResult = await I.checkApiResponse(requestData, expectedResult)
    assert.equal(checkResult, true, checkResult) 

}).retry(1);
```

После генерации необходимо подготовить тесты. Отредактировать параметры запроса, находящиеся в requestData, и сверить ожидаемый результат в expectedResult.

### Шаг 3. 

Когда тесты написаны, генерируем проверочные jsonschema. Команду запускать только под VPN, сервис Zuplo.com блокирует российски IP-адреса, команда не сработает.
`npm run step3.createJsonschemaFiles`

Данная команда:
- сканирует все директории в sandbox, 
- читает все файлы с тестами, забирает из каждого теста requestData,
- выполняет запрос с requestData к config.BaseUrl
- полученный ответ отправляет по api в jsonschema.net
- в ответ приходит проверочная схема, которую сохраняем в соответствующий файл

### Шаг 4. 

Получившиеся папки-тесты-файлы можно перетаскивать в нужную директорию, в данном случае api_tests.
Прогон тестов из этой папки запускается по команде
`npm run codeceptjs`

## Тестовые прогоны

Подготовил наборы тестов на примере https://petstore.swagger.io/.
Запуск успешных тестов по команде 
`npm run examples:good`
Запуск тестов с ошибками по команде 
`npm run examples:errors`
