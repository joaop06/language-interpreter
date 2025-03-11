# Interpreter

`Interpreter` is a lightweight and efficient Node.js library for managing predefined message files in multiple languages, simplifying the process of translating multilingual applications. It offers dynamic language resolution based on predefined message files in JSON format, making it an ideal tool for localization workflows.

---

## Features

- **Dynamic Language Resolution**: Automatically detects and resolves messages based on the selected language.
- **Fallback Handling**: Ensures default messages are displayed when a translation is unavailable.
- **Flexible File Support**: Works with JSON, YAML, and other common formats for message storage.
- **Simple API**: Intuitive and easy-to-use interface for developers.
- **Scalable**: Supports applications of all sizes, from small projects to enterprise-level systems.

---

## Installation

To install the library, run the following command:

```bash
npm install interpreter
```

Or using Yarn:

```bash
yarn add interpreter
```

---

## File Structure

Organize your translation files in a structured way for better maintainability:

```
project/
├── locales/
│   ├── en.json
│   ├── es.json
│   ├── fr.json
├── index.js
```

### Example `en.json` File:

```json
{
  "farewell": "Goodbye",
  "hello": "Hello, {{name}}!!",
  "welcome": "Welcome to our application!"
}
```

### Example `es.json` File:

```json
{
  "farewell": "Adiós",
  "hello": "Hola, {{name}}!!",
  "welcome": "¡Bienvenido a nuestra aplicación!"
}
```

---

## Getting Started

### 1. Importing the Library

```javascript
const { Interpreter } = require('interpreter');
```
Or:
```javascript
import { Interpreter } from 'interpreter';
```

### 2. Initializing the Interpreter

Initialize the library to generate its type files based on the JSON files in the "locales" directory:

```javascript
const interpreter = new Interpreter({
	defaultLanguage: 'en',
	localesPath: __dirname + 'locales',
});
```

This will generate a types folder in the specified directory that can be imported from the “index.d.ts” file with the “LanguagesTypes” type to facilitate usability.

```javascript
import { Interpreter } from 'interpreter';
import { LanguagesTypes } from './locales/types';

const interpreter = new Interpreter<LanguagesTypes>({
    defaultLanguage: 'en',
    localesPath: __dirname + 'locales',
});
```

### 3. Set default language

You can set a new default language:

```javascript
// Set the desired default language (optional)
interpreter.setDefaultLanguage('es');
```

### 4. Retrieving Translations

Use the `translate` method to retrieve translations dynamically:

```javascript
// Retrieve a message
const farewell = interpreter.translate('farewell');
console.log(farewell); // "Hello"
```

### 5. Translate options

#### Lang

```javascript
const farewell = interpreter.translate('farewell', { lang: 'pt-br' });
console.log(farewell); // "Hello"
```

#### Args
```javascript
const hello = interpreter.translate('hello', { args: { name: 'John' } });
console.log(farewell); // "Hello, John!!"
```

### 6. Handling Missing Translations

If a translation is missing, the library will automatically fallback to the default language:

```javascript
// Default language (e.g., 'en')
interpreter.setDefaultLanguage('en');

// Retrieve a non-existent key
const message = interpreter.translate('nonexistent_key'); // throw Error "Key not found"
```

---

## API Reference

### `Interpreter(config: Config)`
Creates a new instance of the `Interpreter`.

- **Parameters:**
  - `localesPath` (string): Path of the translation files.
  - `defaultLanguage` (string): Default language to be used if no other language is specified or found.

### `setDefaultLanguage(language: string)`
Set the new default language for translations.

- **Parameters:**
  - `language` (string): The language code (e.g., `en`, `es`).

### `translate(key: string, options?: TranslateOptions)`
Retrieves the translation for a given key.

- **Parameters:**
  - `key` (string): The key to look up in the message files.
  - `options` (object, optional): An object that contains translation options, such as language and/or arguments with values to be replaced in the translated message.

- **Returns:**
  - `string`: The translated message.

### Example with Variables:

```javascript
// Translation file (en.json)
{
  "welcome_user": "Welcome, {name}!"
}

// Usage
const message = interpreter.translate('welcome_user', { name: 'John' });
console.log(message); // "Welcome, John!"
```

---

## Best Practices

1. **Use Consistent Keys:** Ensure all message keys are uniform across different languages.
2. **Fallback Default Language:** Always set a reliable default language to avoid missing translations.
3. **Organize Files Logically:** Group translations by feature or module for easier maintainability.

---

## Contributing

We welcome contributions to improve the `Interpreter` library! Please follow these steps:

1. Fork the [GitHub repository](https://github.com/joaop06/Interpreter).
2. Create a new branch (`feature/new-feature`).
3. Commit your changes.
4. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Support

If you encounter any issues or have questions, feel free to open an issue on the [GitHub repository](https://github.com/joaop06/Interpreter) or reach out to us directly.

