
const { formatDate, convertDateFormat } = require('./dateUtils');
const axios = require('axios');
const fs = require('fs');


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
      const newData = {
        date: syncDate,
        currency: currency,
        code: code,
        rate: rate,
      }

      if (Object.keys(newData).length === 4) {
        const dbFile = 'dataBase.json';
        let data = JSON.parse(fs.readFileSync(dbFile));
        if (newData.date && newData.currency && newData.code && newData.rate) {
          if (!JSON.stringify(data.dataBase).includes(JSON.stringify(newData))) {
            data.dataBase.push(newData);
            fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));

          }
        }
      }
    }
  }
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

function fillByPeriod (startDate, endDate) {
  const dateRange = getDateRange(startDate, endDate);
  for (const date of dateRange) {
    fillDb(date);
  }
}

module.exports = {
  fillByPeriod
};