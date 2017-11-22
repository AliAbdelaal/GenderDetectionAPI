const config = require('./test/Resources/config');
const Gender = require('./src/Gender');
const gender = new Gender(config);

gender.determineByName('Ali').then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
});
