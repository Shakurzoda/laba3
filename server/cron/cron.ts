const cron = require('node-cron');
const axios = require('axios');
/* const syncData = () => {
  // код для синхронизации данных в БД
  const newData = // получение новых данных
  fs.writeFileSync(dataFile, JSON.stringify(newData));
}  */
// Функция для выполнения синхронизации
const performSync = async () => {
  try {
    const response = await axios.get('https://api.example.com/data');
    const data = response.data;
    
    console.log('Sync completed at 22:27');
  } catch (error) {
    console.error('An error occurred while fetching data:', error);
  }
};

cron.schedule('27 22 * * *', () => {
  performSync();
});


// Выполнять функцию каждый день в 00:00
/* cron.schedule('0 0 * * *', () => {
  syncData();
}); */