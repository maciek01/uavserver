
var conf = require('./conf/conf');
var logger = require('./logger/logger').logger;


class Service {

    constructor() {

    }

    init() {
        logger.info('SERVICE: init');
    }


}

let service = new Service();
service.init();

module.exports=service;
