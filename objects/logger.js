const fs = require('fs');
const { getDateString } = require('./functions');
const logFolder = 'logs/';

class Logger {
    static logMessage(log_message) {
        try {
            if (!fs.existsSync(logFolder)) fs.mkdirSync(logFolder);
            fs.appendFileSync(`${logFolder}/discord server.log`, `\`[${getDateString()}]\` ${log_message}\n`);
        } catch (err) {
            console.error(`Ошибка логирования: ${err.stack || err.message}`);
        }
    }

    static errMessage(err_message) {
        try {
            if (!fs.existsSync(logFolder)) fs.mkdirSync(logFolder);
            fs.appendFileSync(`${logFolder}/errors.log`, `\`[${getDateString()}]\` ${err_message}\n`);
        } catch (err) {
            console.error(`Ошибка логирования: ${err.stack || err.message}`);
        }
    }
}

module.exports = Logger;
