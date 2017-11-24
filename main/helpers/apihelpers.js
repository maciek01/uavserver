/**
 * Created by slavas on 4/11/2016.
 */
var cuid = require("cuid");
var apidefs = require('./apidefs');
var apiResult = require('./apiresult');
var logger = require("../logger/logger").logger;


const log = function (msg) {
   logger.trace(`${msg}`);
};
// Success response to the request
exports.sendSuccess = function (req, res, data) {
    module.exports.sendAPIResult(req, res, new apiResult(apidefs.API_CODES.SUCCESS, 200, '', data, ''));
};

// Success response to the request with specific codes
exports.sendSuccessEx = function (req, res, apicode, httpcode, data) {
    module.exports.sendAPIResult(req, res, new apiResult(apicode, httpcode, '', data, ''));
};

// Repond with error to the request
exports.sendError = function (req, res, message, error, data) {
    module.exports.sendAPIResult(req, res, new apiResult(apidefs.API_CODES.FAIL, 500, message, data, error));
};

// Repond with Error with specific codes
exports.sendErrorEx = function (req, res, apicode, httpcode, message, error, data) {
    module.exports.sendAPIResult(req, res, new apiResult(apicode, httpcode, message, data, error));
};

exports.sendAPIResult = function (req, res, apiresult) {
    module.exports.traceAPIResponse(req, res, apiresult);
    res.status(apiresult.httpcode).json(apiresult.result);
};

exports.sendErrorResponse = function (req, res, httpcode, message) {
  module.exports.sendAPIResult(req, res, new apiResult(apidefs.API_CODES.FAIL, httpcode, message, '', ''));
};

// Handle exception during API processing
exports.handleException = function (req, res, error) {
    module.exports.handleResult(req, res, error);
};

// Standard handling of operation result
// "result" can be apiResult, or Error
exports.handleResult = function (req, res, result) {
    if (result instanceof apiResult) {
        module.exports.sendAPIResult(req, res, result);
    } else if (result instanceof Error) {
        module.exports.traceAPI(req, 'EXCEPTION: ' + result.message + ', STACK:\n' + result.stack);
        module.exports.sendAPIResult(req, res, new apiResult(apidefs.API_CODES.FAIL, 500, result.message, null, 'Failed to process request: ' + result.message));
    } else {
        module.exports.sendAPIResult(req, res, new apiResult(apidefs.API_CODES.FAIL, 500, 'Request processing failure'));
    }
};

exports.traceAPI = function (req, msg) {
    var reqid = req.hasOwnProperty('log') && req.log.hasOwnProperty('requestId') ? req.log.requestId : 'noid';
    log('API[' + reqid + ']: ' + msg, 'debug');
};

exports.traceAPIRequest = function (req) {
    var clientip = req.connection.remoteAddress;
    if (req.headers['x-forwarded-for']) {
        clientip += ',' + req.headers['x-forwarded-for'];
    }
    var paramsstr = JSON.stringify(req.params);
    var body = JSON.stringify(req.body);
    req.log = { "requestId": cuid(), "clientip": clientip };
    module.exports.traceAPI(req, '<<<< ' + req.method + ' ' + req.url + ' ' + paramsstr + ' ' + body + ' (' + req.log.clientip + ')');
};

exports.traceAPIResponse = function (req, res, apiresult) {
    var strbody = JSON.stringify(apiresult.result);
    module.exports.traceAPI(req, '>>>> ' + apiresult.httpcode + ' ' + apiresult.message + ' ' + strbody +
      ((typeof req.log === 'undefined' || req.log === null) ? '' : ' (' + req.log.clientip + ')') );
};
