const express = require('express');
const axios = require('axios');
const cron = require('node-cron');

const app = express();
const PORT = 3000;

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
