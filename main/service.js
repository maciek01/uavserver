
var conf = require('./conf/conf');
var logger = require('./logger/logger').logger;
const apidefs = require('./helpers/apidefs');
const apiHelpers = require('./helpers/apihelpers');


class Service {

    constructor() {

    }

    init() {
        logger.info('SERVICE: init');
    }

    createHeartbeat(req, res) {
        try {

            return apiHelpers.sendSuccess(req, res, {heartbeat: req.body, requestedactions: []});

        } catch (e) {
            logger.info("Error processing heartbeat: " + e);
            return apiHelpers.sendError(req, res, apiDefs.API_ERRORS.InternalError, null, null);
        }

    }


}

let service = new Service();
service.init();

module.exports=service;
