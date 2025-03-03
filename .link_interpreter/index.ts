import { Interpreter } from 'interpreter';
import { JsonTypes } from 'locales/json-structures.type';

const interpreter = new Interpreter<JsonTypes>({
    defaultLanguage: 'en',
    basePath: __dirname + '/locales',
});
