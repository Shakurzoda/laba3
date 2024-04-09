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

function getCurrentDate() {
    let currentDate = new Date();

    let day = currentDate.getDate();
    let month = currentDate.getMonth() + 1; // Месяцы в объекте Date начинаются с 0, поэтому добавляем 1
    let year = currentDate.getFullYear();

    // Добавляем ведущий ноль, если число меньше 10
    if (day < 10) {
        day = '0' + day;
    }

    if (month < 10) {
        month = '0' + month;
    }

    return `${day}.${month}.${year}`;
}

function convertDateFormat(date) {
    const dateComponents = date.split('.');
    const day = dateComponents[0];
    const month = dateComponents[1];
    const year = dateComponents[2];
    return new Date(year, month - 1, day);
}

module.exports = {
    formatDate,
    getCurrentDate,
    convertDateFormat
};
