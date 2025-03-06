const { Interpreter } = require('interpreter');
console.log('Module loaded successfully');



const interpreter = new Interpreter({
    defaultLanguage: 'es',
    basePath: __dirname + '/locales'
});
console.log(interpreter.translate('HELLO'));

