const { getDateRange } = require('../fillByPeriod');
const fs = require('fs');

class ReportController {
    async generateReport(req, res, next) {
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        const currencyCodes = req.query.currencyCode;

        // console.log('startDate', startDate);
        // console.log('endDate', endDate);
        // console.log('currencyCodes', currencyCodes);

        function getReportData(datePeriod, currencyCode) {
            let min = 'Нет значений для данной валюты';
            let avg = 'Нет значений для данной валюты';
            let max = 'Нет значений для данной валюты';

            const dbFile = 'dataBase.json';
            const dbData = JSON.parse(fs.readFileSync(dbFile)).dataBase;

            let currentCurrencyRates = [];

            for (const date of datePeriod) {
                for (const dataElement of dbData) {
                    if (dataElement.date === date && dataElement.code === currencyCode) {
                        currentCurrencyRates.push(Number(dataElement.rate));
                    }
                }
            }

            if (currentCurrencyRates.length) {
                min = Math.min.apply(null, currentCurrencyRates);
                max = Math.max.apply(null, currentCurrencyRates);
                avg = Number(
                    (
                        currentCurrencyRates.reduce((a, b) => a + b, 0) /
                        currentCurrencyRates.length
                    ).toFixed(4)
                );
                return { min, avg, max };
            }

            return { empty: 'Нет значений для данной валюты' };
        }

        function getReport(startDate, endDate) {
            const dateRange = getDateRange(startDate, endDate);
            const result = {};

            for (const currencyCode of currencyCodes) {
                console.log('currencyCode', currencyCode);
                result[currencyCode] = getReportData(dateRange, currencyCode);
            }

            return result;
        }

        const finalReport = getReport(startDate, endDate);
        console.log('finalReport', finalReport);
        // res.json(finalReport);

        // return res(finalRepor);
        // res.send(`Результат сложения`);
        // res.send(finalReport);
        res.json(finalReport);

        // return res.json(finalReport);
    }

    // async registration(req, res, next) {
    //     console.log("запросик");
    //     console.log(req.body);
    //     console.log(req);
    //     let { name } = req.body;
    //     const user = { id: 1000, name };
    //     return res.json({ user });
    // }
    // async info(req, res, next) {
    //     console.log(req.body);
    //     let { name } = req.body;

    //     const user = { id: 1000, name };

    //     return res.json({ user });
    // }
}

module.exports = new ReportController();
