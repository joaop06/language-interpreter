import { Interpreter } from 'interpreter';
import { JsonTypes } from 'locales/json-structures.type';

const interpreter = new Interpreter<JsonTypes>({
    basePath: __dirname + '/locales'
});

console.log(interpreter.translate('HELLO'));

interpreter.language = 'es';
console.log(interpreter.translate('HELLO'));