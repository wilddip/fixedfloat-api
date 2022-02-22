const FixedFloat = require('./'); // Change it to 'fixedfloat-api'
const fixed = new FixedFloat('API_KEY', 'API_SECRET');

(async()=>{
    const data = await fixed.getCurrencies();
    console.log(data);
})()