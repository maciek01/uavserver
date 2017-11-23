

const {argv} = require('optimist');
const path = require('path');
const nconf = require('nconf');
const nconfYaml = require('nconf-yaml');
const ramda = require('ramda');
const uuidv4 = require('uuid/v4');
const url = require('url');
var logger = require('../logger/logger').logger;

class Config {

    constructor() {
        this._rootPath = path.resolve(process.cwd());
    }

    resolvePathToConfig() {
        let pathToConf;

        if ('SETTINGS_FILE' in process.env) {
            pathToConf = path.resolve(process.env.SETTINGS_FILE);
        } else if (argv.conf) {
            pathToConf = path.resolve(argv.conf)
        } else {
            pathToConf = path.resolve(__dirname, 'default.yaml')
        }

        return pathToConf
    }


    initialize() {

        let pathToConf = this.resolvePathToConfig();
        logger.info('Configuration: Loading configuration file from ', pathToConf );

        nconf.env().argv();
        nconf.add('global', {type: 'file', file: pathToConf, format: nconfYaml});
        nconf.add('default', {type: 'file', file: 'default.yaml', format: nconfYaml});

        return this;
    }

    getValue(name) {
        return nconf.get(name)
    }

    _getSection(sectionName) {
        const section = this.getValue(sectionName);

        if (!section) {
            return new Proxy({}, {
                get: (target, name) => {
                    return undefined
                }
            });
        }
        return section
    }

    getFromEnvOrConfig(envKey, sectionKey) {
        const envVal = this.getValue(envKey);

        if (envVal) {
            return envVal
        } else {
            let sectionName = ramda.head(sectionKey);
            const section = this._getSection(sectionName);
            return ramda.path(ramda.drop(1, sectionKey), section);
        }
    }

    get serverPort() {
        parseInt(this.getFromEnvOrConfig('SERVER_PORT', ['server', 'port']));
    }

    get logLevel() {
        return this.getFromEnvOrConfig('LOG_LEVEL', ['server', 'logLevel']) || 'info';
    }

    get apiPrefix() {
        return this.getFromEnvOrConfig('API_PREFIX', ['common', 'apiPrefix']) || '/uavserver/v1';
    }

    * [Symbol.iterator]() {
        const descriptions = [
            ['SERVER_PORT', this.serverPort],
            ['API_PREFIX', this.apiPrefix],
            ['LOG_LEVEL', this.logLevel]
        ];

        for (let description of descriptions) {
            yield description;
        }
    }

}

const conf = new Config();
conf.initialize();

module.exports = conf;