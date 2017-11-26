// create a stdout console logger

const opts = {
        timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS',
        logDirectory:'log', // NOTE: folder must exist and be writable...
        fileNamePattern:'uavserver-<DATE>.log',
    };
const log = require('simple-node-logger').createRollingFileLogger(opts);
exports.logger = log;