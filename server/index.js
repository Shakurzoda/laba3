const express = require('express');
const cron = require('node-cron');
const fs = require('fs');

const app = express();
const PORT = 3000;
const router = require("./routes/index");
const { performSync } = require('./dailySyncUtils');
const { fillByPeriod } = require('./fillByPeriod');

// конфигурация ежедневного таймера
let timerData = JSON.parse(fs.readFileSync('dailyTimerConfig.json'));
cron.schedule(`${timerData.minute} ${timerData.hour} * * *`, () => {
  performSync();
});

// заполнить БД выбранной датой
// const fillDb = async (date) => {
//   const response = await axios.get(`https://www.cnb.cz/en/financial_markets/foreign_exchange_market/exchange_rate_fixing/daily.txt?date=${date}`);

//   if (response) {
//     setCurrencyData(response.data, date);
//   }
// }

app.use("/api", router);

/** Указать даты для синхронизации */ 
const startDate = '15.01.2024';
const endDate = '17.01.2024';

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  fillByPeriod(startDate, endDate);
});
