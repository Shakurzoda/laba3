const { getCurrentDate, formatDate } = require('./dateUtils');
const axios = require('axios');
const fs = require('fs');

async function setCurrencyData(textData) {
    const lines = String(textData).split('\n');
    const dateRegex = /(\d{2} \w+ \d{4})/;
    const date = lines[0].match(dateRegex)[0];
    const syncDate = formatDate(date);

    /** проверка, т.к. в API если нет даты - берется первая существующая */
    if (getCurrentDate() !== syncDate) {
        console.log('Нет записей для сегодняшней записи, синхронизация завершена');
        return;
    }

    for (let i = 2; i < lines.length; i++) {
        if (i !== 1) {
            const elements = lines[i].split('|');
            const currency = elements[1];
            const code = elements[3];
            const rate = elements[4];
            const newData = {
                date: syncDate,
                currency: currency,
                code: code,
                rate: rate
            };

            if (Object.keys(newData).length === 4) {
                const dbFile = 'dataBase.json';
                let data = JSON.parse(fs.readFileSync(dbFile));
                if (newData.date && newData.currency && newData.code && newData.rate) {
                    if (!JSON.stringify(data.dataBase).includes(JSON.stringify(newData))) {
                        data.dataBase.push(newData);
                        fs.writeFileSync(dbFile, JSON.stringify(data, null, 4));
                    }
                }
            }
        }
    }
}

/** Функция для выполнения синхронизации */
const performSync = async () => {
    try {
        // const response = await axios.get('https://www.cnb.cz/en/financial_markets/foreign_exchange_market/exchange_rate_fixing/daily.txt?date=27.07.2019');
        const response = await axios.get(
            `https://www.cnb.cz/en/financial_markets/foreign_exchange_market/exchange_rate_fixing/daily.txt?date=${getCurrentDate()}`
        );
        const data = response.data;
        setCurrencyData(data);
        console.log('Синхронизация завершена');
    } catch (error) {
        console.error('An error occurred while fetching data:', error);
    }
};

module.exports = {
    performSync
};
