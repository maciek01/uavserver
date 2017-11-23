
'use strict';

var extend = require('util')._extend;
var Q = require('q');
var http = require('http');
var fs = require('fs-extra');
var path = require('path');
var uuid = require('uuid');
const swaggerUi = require('swagger-ui-express');
var swaggerJSDoc = require('swagger-jsdoc');
var swaggerParser = require('swagger-parser');
// Express and middlewares
var express = require('express');
var expressFavicon = require('serve-favicon');
var expressBodyParser = require('body-parser');
var expressLogger = require('morgan');
var expressMethodOverride = require('method-override');
var expressStatic = require('serve-static');
var expressErrorHandler = require('errorhandler');

var packageInfo = require('./package.json');
var conf = require('./main/conf/conf');
var logger = require('./main/logger/logger').logger;
var serviceapi = require('./main/api');

logger.setLevel(conf.logLevel);
logger.info('STARTING ', new Date().toJSON());

logger.info('Config settings:');
for (let [k, v] of conf) {
    logger.info(`   ${k}:${JSON.stringify(v)}`);
}

var formatVersion = function (version) {
    var segments = version.split('.');
    var third;

    if (parseInt(segments[2], 10) >= 0) {
        third = segments[2].substr(0, 3);
    }

    return segments[0] + '.' + segments[1] + '.' + third;
};
packageInfo.version = formatVersion(packageInfo.version);

// Express server configuration

// Main application API
var app = module.exports = express();
var env = app.get('env');

// metadata about service
app.set('svcInfo', packageInfo);

// all environments
app.set('port', process.env.PORT || conf.serverPort || 9000);
app.use(expressLogger('dev'));
app.use(expressBodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(expressBodyParser.json({limit: '10mb'}));
app.use(expressMethodOverride());

// development only
if (env === 'development') {
    app.use(expressErrorHandler());
}
// Set http caching headers, mark all response as expired one second ago.
app.use(function (req, res, next) {
    res.set('Cache-Control', 'private');
    res.set('Expires', new Date(Date.now() - 1000).toUTCString());
    next();
});


// API
app.use(conf.apiPrefix, serviceapi);

app.get('/info', function (req, res) {
    res.json({name: app.get('svcInfo').name, version: app.get('svcInfo').version});
});

app.get('/settings', function (req, res) {
    app.get('/settings', function (req, res) {
        let settings = {};
        for (let [k, v] of conf) {
            settings[k] = v;
        }
        res.json(settings);
    });
});

// SWAGGER-JSDOC Initialization
var swOptions = {
    swaggerDefinition: {
        "info": {
            "description": "### UAV SERVER API",
            "version": packageInfo.version,
            "title": "uav serverr API"
        },
        //"host": "localhost",
        "basePath": conf.apiPrefix,
        "schemes": ["http"],
        "securityDefinitions": null
    },
    apis: ['./main/api.js']  // Path to the API files with swagger docs in comments
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
var swaggerSpec = swaggerJSDoc(swOptions);

// [SVV] remove securityDefinitions property so it does not appear in api docs
delete swaggerSpec.securityDefinitions;

function displaySwagger (req, res) {
    //res.redirect('/admin');
    var content = '<!DOCTYPE html>\
        <html>\
        <head>\
        <title>API Docs</title>\
            <meta name="viewport" content="width=device-width, initial-scale=1">\
        </head>\
        <body>\
        <redoc spec-url="/uavserver/v1/swagger.json"></redoc>\
        <script src="https://rebilly.github.io/ReDoc/releases/latest/redoc.min.js"></script>\
        </body>\
        </html>';
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(content);
}

function displaySwaggerJSON (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
}

//Index page
app.get('/', displaySwagger);
app.get(conf.apiPrefix, displaySwagger);
app.get(conf.apiPrefix + '/doc', displaySwagger);
app.get(conf.apiPrefix + '/swagger.json', displaySwaggerJSON);

var parser = new swaggerParser();

parser.validate(swaggerSpec, function (err, api) {

    if (err) {
        console.log('Error validating swagger spec: ' + err);
        return;
    }


    // Setup server
    var server = http.createServer(app);

    // Start server
    server.listen(app.get('port'), function () {
        logger.info('Service listening on port ' + app.get('port'));
        logger.info('Service url: http://localhost:' + app.get('port'));
        logger.info('Service name: ' + app.get('svcInfo').name + ', version: ' + app.get('svcInfo').version);
    });

});




// EVENTS //////////////////////////////////////////////////////////////////


process.on('SIGTERM', function () {
    logger.info('Service shutting down gracefully');
    process.exit();
});

process.on('SIGINT', function () {
    logger.info('Service down gracefully');
    process.exit();
});

process.on('uncaughtException', function (err) {
    logger.fatal('Uncaught Exception - Service is exiting: %s', err.message );
    logger.fatal(err.stack);
});
