

const FIFO = require('fifo');

var conf = require('./conf/conf');
var logger = require('./logger/logger').logger;
const apidefs = require('./helpers/apidefs');
const apiHelpers = require('./helpers/apihelpers');


class Service {

    constructor() {
        //heartbeats
        this.activeUnits = [];
        this.idCounter = 0;

        // actions
        this.requestQueues = [];

        // adsb targets - each entry is a list of adsbs in the vivinity of a uav unit - map by unitId
        this.adsbs = [];
    }

    init() {
        logger.info('SERVICE: init');
    }


    // UNIT / UAV METHODS

    createHeartbeat(req, res) {

        try {

            let heartbeat = req.body;

            heartbeat.unitHostAddress = req.log.clientip;

            let lastHeartbeat = this.activeUnits[heartbeat.unitId];

            if (lastHeartbeat == null) {
                lastHeartbeat = {
                    id: ++this.idCounter,//generate request id
                    receivedTimestampMS: new Date().getTime(),
                    heartbeat: heartbeat
                };

                this.activeUnits[heartbeat.unitId] = lastHeartbeat;

            } else {
                let currentHeartbeat = JSON.parse(JSON.stringify(lastHeartbeat.heartbeat));

                //in place copy
                for (var key in heartbeat) {
                    if (heartbeat.hasOwnProperty(key)) {
                        currentHeartbeat[key] = heartbeat[key];
                    }
                }

                lastHeartbeat.id = ++this.idCounter;//generate request id
                lastHeartbeat.receivedTimestampMS = new Date().getTime();
                lastHeartbeat.heartbeat = currentHeartbeat;
            }

            //fetch commands from the command queue
            try {
                lastHeartbeat.actionRequests = this.listAllActionRequestsInt(heartbeat.unitId, true);
            } catch (e) {
                lastHeartbeat.actionRequests = {};
            }

            let returnData = JSON.parse(JSON.stringify(lastHeartbeat));
            returnData.heartbeat = {}; //minimize return payload to uav

            return apiHelpers.sendSuccess(req, res, returnData);

        } catch (e) {
            logger.error("Error processing create heartbeat: ", e);
            throw e;
        }

    }

    //create an adsb entry for unit - list of adbs in vicinity of the uav
    createAdsb(req, res) {

        try {

            let adsb = req.body;

            let lastAdsb = this.adsbs[adsb.unitId];

            if (lastAdsb == null) {
                lastAdsb = {
                    receivedTimestampMS: new Date().getTime(),
                    adsb: adsb
                };

                this.adsbs[adsb.unitId] = lastAdsb;

            } else {
                lastAdsb.receivedTimestampMS = new Date().getTime();
                lastAdsb.adsb = adsb;
            }

            let returnData = JSON.parse(JSON.stringify(lastAdsb));
            returnData.adsb = {}; //minimize return payload to uav

            return apiHelpers.sendSuccess(req, res, returnData);

        } catch (e) {
            logger.error("Error processing create adsb: ", e);
            throw e;
        }

    }

    listHeartbeats(req,res) {
        try {
            let wrapper = {
                heartbeats: []
            };

            for (var key in this.activeUnits) {
                if (this.activeUnits.hasOwnProperty(key)) {
                    wrapper.heartbeats.push(this.activeUnits[key]);
                }
            }

            return apiHelpers.sendSuccess(req, res, wrapper);

        } catch (e) {
            logger.error("Error processing get heartbeats: ", e);
            throw e;
        }
    }

    listAdsbs(req,res) {
        try {
            let wrapper = {
                adsbs: []
            };

            for (var key in this.adsbs) {
                if (this.adsbs.hasOwnProperty(key)) {
                    wrapper.adsbs.push(this.adsbs[key]);
                }
            }

            return apiHelpers.sendSuccess(req, res, wrapper);

        } catch (e) {
            logger.error("Error processing get adsbs: ", e);
            throw e;
        }
    }


    getHeartbeat(req,res) {
        try {
            let unit = this.activeUnits[req.params.unitId];

            if (!unit) {
                //TODO return 404 code
            }

            return apiHelpers.sendSuccess(req, res, unit);
        } catch (e) {
            logger.error("Error processing get heartbeat: ", e);
            throw e;
        }
    }

    getAdsb(req,res) {
        try {
            let unit = this.adsbs[req.params.unitId];

            if (!unit) {
                //TODO return 404 code
            }

            return apiHelpers.sendSuccess(req, res, unit);
        } catch (e) {
            logger.error("Error processing get heartbeat: ", e);
            throw e;
        }
    }

    // UI METHODS

    addActionRequest(req, res) {
        try {

            let actionRequest = req.body;

            if (!actionRequest || !actionRequest.unitId) {
                return apiHelpers.sendSuccess(req, res, null);//TODO return action response with a code
            }

            let queue = this.requestQueues[actionRequest.unitId];

            if (!queue) {
                queue = FIFO();

                this.requestQueues[actionRequest.unitId] = queue;
            }

            queue.push(actionRequest);

            return apiHelpers.sendSuccess(req, res, null);
        } catch (e) {
            logger.error("Error processing create action: ", e);
            throw e;
        }
    }

    listAllActionRequests(req, res) {
        try {

            let actions = this.listAllActionRequestsInt(req.params.unitId, false);

            return apiHelpers.sendSuccess(req, res, actions);
        } catch (e) {
            logger.error("Error processing list actions: ", e);
            throw e;
        }
    }

    listAllActionRequestsInt(unitId, consume) {
        let actions = [];

        let queue = this.requestQueues[unitId];
        if (!queue) {
            return null;
        }

        for (var node = queue.node; node; node = queue.next(node)) {
            actions.push(node.value);
        }

        if (consume == true) {
            this.requestQueues[unitId] = null;
        }
        return actions;
    }

    removeAllActionRequests(req, res) {
        try {
            let queue = this.requestQueues[req.params.unitId];
            if (queue == null) {
                return apiHelpers.sendSuccess(req, res, null);
            }
            this.requestQueues[req.params.unitId] = null;

            return apiHelpers.sendSuccess(req, res, null);
        } catch (e) {
            logger.error("Error processing remove actions: ", e);
            throw e;
        }
    }
}

let service = new Service();
service.init();

module.exports=service;
