import { Interpreter } from 'interpreter';

const interpreter = new Interpreter({
    defaultLanguage: 'example',
    basePath: __dirname + '/locales',
});
console.log(interpreter.translate('key'));

interpreter.language = 'example2';
console.log(interpreter.translate('key'));