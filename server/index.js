const express = require('express');
const cron = require('node-cron');
const fs = require('fs');

const app = express();
const PORT = 3000;
const router = require('./routes/index');
const { performSync } = require('./dailySyncUtils');
const { fillByPeriod } = require('./fillByPeriod');

/** конфигурация ежедневного таймера */
let timerData = JSON.parse(fs.readFileSync('dailyTimerConfig.json'));
cron.schedule(`${timerData.minute} ${timerData.hour} * * *`, () => {
    performSync();
});

app.use('/api', router);

/** Указать даты для синхронизации */
const startDate = '08.04.2024';
const endDate = '08.04.2024';

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    fillByPeriod(startDate, endDate);
});
