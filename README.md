# Gender Detection


Get The gender of certain name via GenderApi and fullcontact API(s)


# how to use #
to use this module, you need to update your cridentails in the config file, then you're ready to go

a demo is represented in the demo.js file 

you need to run ```npm install``` to load all the project libs

demo example

```nodejs

const config = require('path/to/conif');
const Gender = require('./src/Gender');
const gender = new Gender(config);

gender.determineByName('Ali').then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
});

```