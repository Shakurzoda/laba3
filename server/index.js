const express = require('express');
const axios = require('axios');
const cron = require('node-cron');
const fs = require('fs');
// const { getCurrencyData } = require('./utils');

const app = express();
const PORT = 3000;
const router = require("./routes/index");

// Функция для выполнения синхронизации
const performSync = async () => {
  try {
    const response = await axios.get('https://www.cnb.cz/en/financial_markets/foreign_exchange_market/exchange_rate_fixing/daily.txt?date=27.07.2019');
    const data = response.data;
    console.log('Sync completed at 22:27');
    console.log('Data = ', data);
  } catch (error) {
    console.error('An error occurred while fetching data:', error);
  }
};

cron.schedule('41 22 * * *', () => {
  performSync();
});

function formatDate(inputDate) {
  const months = {
      Jan: '01',
      Feb: '02',
      Mar: '03',
      Apr: '04',
      May: '05',
      Jun: '06',
      Jul: '07',
      Aug: '08',
      Sep: '09',
      Oct: '10',
      Nov: '11',
      Dec: '12'
  };
  const parts = String(inputDate).split(' ');
  const day = parts[0].padStart(2, '0');
  const month = months[parts[1]];
  const year = parts[2];
  return `${day}.${month}.${year}`;
}

const getCurrencyData = async (textData) => {
  const lines = String(textData).split('\n');
  const dateRegex = /(\d{2} \w+ \d{4})/;
  const date = lines[0].match(dateRegex)[0];

  for (let i = 2; i < lines.length; i++) {
    if (i !== 1) {
      const elements = lines[i].split('|');
      const syncDate = formatDate(date);
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
        console.log('data -------', data)
        // Добавляем новые данные
        data.dataBase.push(newData);
        // Записываем обновленные данные обратно в JSON-файл
        fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
      }
    }
  }

  // await axios.post("/dataBase/dataBase", {authorId, title, description, image: courseImage, type})
}

const fillDb = async (date) => {
  const response = await axios.get(`https://www.cnb.cz/en/financial_markets/foreign_exchange_market/exchange_rate_fixing/daily.txt?date=${date}`);
  // console.log('response = ', response);
  if (response) {
    console.log('typeof response ', typeof response)
    const data = getCurrencyData(response.data);
  }
}

app.use("/api", router);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  fillDb('07.04.2024')
});
