const { getDateRange } = require('../fillByPeriod');
const fs = require('fs');

class ReportController {
    async generateReport(req, res, next) {
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        const currencyCodes = req.query.currencyCode;

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
                result[currencyCode] = getReportData(dateRange, currencyCode);
            }

            return result;
        }

        const finalReport = getReport(startDate, endDate);

        console.log('report: ', finalReport);
        res.json(finalReport);
    }
}

module.exports = new ReportController();
