const express = require('express');
const axios = require('axios');
const cron = require('node-cron');
const fs = require('fs');

const app = express();
const PORT = 3000;
const router = require("./routes/index");
const { formatDate, convertDateFormat } = require('./dateUtils');
const { performSync } = require('./dailySyncUtils');

// конфигурация ежедневного таймера
let timerData = JSON.parse(fs.readFileSync('dailyTimerConfig.json'));
cron.schedule(`${timerData.minute} ${timerData.hour} * * *`, () => {
  performSync();
});



async function setCurrencyData (textData, initialDate) {
  const lines = String(textData).split('\n');
  const dateRegex = /(\d{2} \w+ \d{4})/;
  const date = lines[0].match(dateRegex)[0];
  const syncDate = formatDate(date);

  // проверка, т.к. в API если нет даты - берется первая существующая
  if (syncDate !== initialDate) {
    return;
  }

  for (let i = 2; i < lines.length; i++) {
    if (i !== 1) {
      const elements = lines[i].split('|');
      const currency = elements[1];
      const code = elements[3];
      const rate = elements[4];
      // console.log(formatDate(date), currency, code, rate);
      // await axios.post("/dataBase/dataBase", { syncDate, currency, code, rate })

      const newData = {
        date: syncDate,
        currency: currency,
        code: code,
        rate: rate,
      }

      if (Object.keys(newData).length === 4) {
        // Определяем путь до вашего JSON-файла
        const dbFile = 'dataBase.json';
        // Читаем текущие данные из файла
        let data = JSON.parse(fs.readFileSync(dbFile));
        // console.log('data -------', data)
        // const updatedData = {dataBase:[...data.dataBase.filter((element) => element.date !== newData.date)]};
        // Добавляем новые данные
        // console.log('updatedData', updatedData);
        if (newData.date && newData.currency && newData.code && newData.rate) {
          if (!JSON.stringify(data.dataBase).includes(JSON.stringify(newData))) {
            data.dataBase.push(newData);
            fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));

          }
          // if (data.dataBase.)
          // data.dataBase.push(newData);
          // console.log('newData', newData)
          // Записываем обновленные данные обратно в JSON-файл
          // fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
          // fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
        }
      }
    }
  }

  // await axios.post("/dataBase/dataBase", {authorId, title, description, image: courseImage, type})
}

// заполнить БД выбранной датой
const fillDb = async (date) => {
  const response = await axios.get(`https://www.cnb.cz/en/financial_markets/foreign_exchange_market/exchange_rate_fixing/daily.txt?date=${date}`);

  if (response) {
    setCurrencyData(response.data, date);
  }
}



function getDateRange(startDate, endDate) {
  const dateArray = [];

  let currentDate = new Date(convertDateFormat(startDate));

  while (currentDate <= new Date(convertDateFormat(endDate))) {
    let day = currentDate.getDate();
    let month = currentDate.getMonth() + 1; // Месяцы в объекте Date начинаются с 0, поэтому добавляем 1
    let year = currentDate.getFullYear();

    let formattedDate = `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;

    dateArray.push(formattedDate);

    currentDate.setDate(currentDate.getDate() + 1); // Увеличиваем дату на 1 день
  }
  // console.log('dateArray', dateArray);
  return dateArray;
}


const fillByPeriod = (startDate, endDate) => {
  const dateRange = getDateRange(startDate, endDate);

  for (const date of dateRange) {
    fillDb(date);
  }
}

app.use("/api", router);

/** Указать даты для синхронизации */ 
const startDate = '01.01.2024';
const endDate = '03.01.2024';

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  fillByPeriod(startDate, endDate);
  // performSync();
  // let dateRange = getDateRange(startDate, endDate);
  // console.log(dateRange);
  // fillDb('08.04.2024')
});
