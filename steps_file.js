// in this file you can append custom step methods to 'I' object

const { API_TIMEOUT, API_HEADERS } = inject();
const { config } = require('codeceptjs');
const assert = require('assert');
const axios = require('axios');
var tv4 = require('tv4');

module.exports = function() {
  return actor({

    // Define custom steps here, use 'this' to access default methods of I.
    // It is recommended to place a general 'login' function here.


    // Проверка ответа API
    checkApiResponse: async function(requestData, expectedResult) {
      // Предварительно обновляем параметры запроса, добавляя прописанные в основном конфиге (заголовки, таймаут)
      let options = await this.createOptionsForAxios(requestData);
      const response = await axios(options)
      
      // Сравнение кода ответа с ожидаемым
      if (Object.prototype.hasOwnProperty.call(expectedResult, 'expectedStatus')) {
        try {
          assert.equal(response.status, expectedResult.expectedStatus, `Код ответа - ${response.status}. Ожидаемый - ${expectedResult.expectedStatus}`)
        }
        catch (error) {
          return error.message;
        }
      }
      
      // Сравнение схемы ответа с ожидаемой, в том числе проверка структуры, ключей, их типов
      if (Object.prototype.hasOwnProperty.call(expectedResult, 'expectedSchema')) {
        const result = await tv4.validateMultiple(response.data, expectedResult.expectedSchema)
        try {
          assert.equal(result, true)
        }
        catch (error) {
          let errMessage = 'Схема ответа не прошла валидацию. Ошибка в точке:'
          if(!result.valid) {
            
            // Каждое отклонение от схемы добавляем в сообщение об ошибке
            result.errors.forEach(error => 
              errMessage += `\n${error.schemaPath}`);
              
            return errMessage;

          } else {
              return true
          }
        }
      }
      
    },
  
  
    // составление запроса для axios
    createOptionsForAxios: async function (requestData) {
      const params = new URLSearchParams();
      for(const [key, value] of Object.entries(requestData.params)) {
          params.append(key, value)
      }
      let query = params.toString()
      
      // формируем url, добавляя query-параметры, если они есть
      let url_variable = '';
      if (query != '') {
          url_variable = requestData.url
      } else {
          url_variable = requestData.url + '?' + query
      }
      
      const axiosOptions = {
          method: requestData.method,
          baseURL: config.get().BaseUrl,
          url: url_variable,
          timeout: requestData.timeout || API_TIMEOUT,
          headers: API_HEADERS,
          data: requestData.data
      }
      
      return axiosOptions;
    },



  });
}
