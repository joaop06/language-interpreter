# Interpreter

`Interpreter` is a lightweight and efficient Node.js library for managing predefined message files in multiple languages, simplifying the translation process for multilingual applications. It provides dynamic language resolution, support for various file formats, and automatic fallback handling, making it an ideal tool for localization workflows.

---

## Features

- **Dynamic Language Resolution**: Automatically detects and resolves messages based on the selected language.
- **Fallback Handling**: Ensures default messages are displayed when a translation is unavailable.
- **Flexible File Support**: Works with JSON, YAML, and other common formats for message storage.
- **Simple API**: Intuitive and easy-to-use interface for developers.
- **Scalable**: Supports applications of all sizes, from small projects to enterprise-level systems.
- **Integration Friendly**: Compatible with popular internationalization libraries like `i18next` and `Intl`.

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

## Getting Started

### 1. Importing the Library

```javascript
const Interpreter = require('interpreter');
```

### 2. Initializing the Interpreter

Initialize the library by loading your message files:

```javascript
const messages = {
  en: require('./locales/en.json'),
  es: require('./locales/es.json'),
  fr: require('./locales/fr.json'),
};

const interpreter = new Interpreter(messages);
```

### 3. Retrieving Translations

Use the `translate` method to retrieve translations dynamically:

```javascript
// Set the desired language
interpreter.setLanguage('es');

// Retrieve a message
const greeting = interpreter.translate('greeting'); // "Hola"
console.log(greeting);
```

### 4. Handling Missing Translations

If a translation is missing, the library will automatically fallback to the default language:

```javascript
// Default language (e.g., 'en')
interpreter.setDefaultLanguage('en');

// Retrieve a non-existent key
const message = interpreter.translate('nonexistent_key'); // "Key not found"
console.log(message);
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
  "greeting": "Hello",
  "farewell": "Goodbye",
  "welcome": "Welcome to our application!"
}
```

### Example `es.json` File:

```json
{
  "greeting": "Hola",
  "farewell": "Adiós",
  "welcome": "¡Bienvenido a nuestra aplicación!"
}
```

---

## API Reference

### `Interpreter(messages: object)`
Creates a new instance of the `Interpreter`.

- **Parameters:**
  - `messages` (object): An object containing language codes as keys and message objects as values.

### `setLanguage(language: string)`
Sets the current language for translations.

- **Parameters:**
  - `language` (string): The language code (e.g., `en`, `es`).

### `setDefaultLanguage(language: string)`
Sets the default language to use as a fallback.

- **Parameters:**
  - `language` (string): The default language code.

### `translate(key: string, variables?: object)`
Retrieves the translation for a given key.

- **Parameters:**
  - `key` (string): The key to look up in the message files.
  - `variables` (object, optional): An object containing variables to replace in the translation string.

- **Returns:**
  - `string`: The translated message or a fallback message if the key is not found.

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

1. Fork the repository.
2. Create a new branch (`feature/new-feature`).
3. Commit your changes.
4. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Support

If you encounter any issues or have questions, feel free to open an issue on the [GitHub repository](https://github.com/yourusername/interpreter) or reach out to us directly.

---

## Acknowledgments

Special thanks to the open-source community for inspiring the development of this library.
