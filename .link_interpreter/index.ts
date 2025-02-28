import { Interpreter } from 'interpreter';

const interpreter = new Interpreter({
    basePath: __dirname + '/locales'
});

console.log(interpreter.translate(''));

interpreter.language = 'es';
console.log(interpreter.translate(''));