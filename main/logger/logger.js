// create a stdout console logger

const opts = {
        timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
    };
const log = require('simple-node-logger').createSimpleLogger(opts);
exports.logger = log;