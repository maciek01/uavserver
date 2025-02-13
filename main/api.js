/*
 * API IMPLEMENTATION
 */

'use strict';

var util = require('util');
var express = require('express');
var router = express.Router();
var conf = require('./conf/conf');
var logger = require('./logger/logger').logger;
var service = require("./service");
const apidefs = require('./helpers/apidefs');
const apiHelpers = require('./helpers/apihelpers');

// API DEFINITION ///////////////////////////////////////////////////////// //

/**
 * @swagger
 * tags:
 *   - name: uav server
 *     description: manages uav events, exposes state of uavs to consumers
 */

/**
 * @swagger
 * definitions:
 *  errorModel:
 *    type: object
 *    required:
 *      - code
 *    properties:
 *      code:
 *        type: integer
 *        description: Operation status code
 *      detail:
 *        type: object
 *        properties:
 *          message:
 *            type: string
 *            description: Error Message
 *          error:
 *            type: object
 *            description: Error details object
 *      data:
 *        type: object
 *        description: Additional data associated with error
 *  heartbeat:
 *    type: object
 *  adsb:
 *    type: object
 *  actionrequest:
 *    type: object
 *  heartbeatwrapper:
 *    type: object
 *    properties:
 *      heartbeat:
 *        $ref: '#/definitions/heartbeat'
 *      actionrequests:
 *        type: array
 *        items:
 *          $ref: '#/definitions/actionrequest'
 *  heartbeatswrapper:
 *    type: object
 *    properties:
 *      heartbeats:
 *        type: array
 *        items:
 *          $ref: '#/definitions/heartbeatwrapper'
 *  adsbwrapper:
 *    type: object
 *    properties:
 *      adsb:
 *        $ref: '#/definitions/adsb'
 *  adsbswrapper:
 *    type: object
 *    properties:
 *      adsbs:
 *        type: array
 *        items:
 *          $ref: '#/definitions/adsbwrapper'
 */


// API METHODS //////////////////////////////////////////////////////////// //


// UNIT/UAV HEARTBEATS

/**
 * @swagger
 *  /heartbeat:
 *    post:
 *      operationId: create heartbeat
 *      description: Create new heartbeat
 *      summary: Create HeartBeat
 *      tags:
 *        - heartbeat
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: heartbeat
 *          in: body
 *          description: heartbeat to be created
 *          required: true
 *          schema:
 *            $ref: '#/definitions/heartbeat'
 *      responses:
 *        '200':
 *          description: return action request array or nothing
 *          schema:
 *            type: object
 *            required:
 *              - code
 *            properties:
 *              code:
 *                type: integer
 *                description: Operation status code
 *              data:
 *                description: action requests to be processed by uav
 *                $ref: '#/definitions/heartbeatwrapper'
 *        default:
 *          description: error
 *          schema:
 *            $ref: '#/definitions/errorModel'
 */
router.post('/heartbeat', function(req, res) {
    apiHelpers.traceAPIRequest(req);
    try {
        service.createHeartbeat(req,res);
    }catch(e) {
        apiHelpers.handleException(req,res,e);
    }
});


/**
 * @swagger
 *  /heartbeats:
 *    get:
 *      operationId: get all active heartbeats
 *      description: return all current uav heartbeats
 *      summary: return all current uav heartbeats
 *      tags:
 *        - heartbeat
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: return action request array or nothing
 *          schema:
 *            type: object
 *            required:
 *              - code
 *            properties:
 *              code:
 *                type: integer
 *                description: Operation status code
 *              data:
 *                description: action requests to be processed by uav
 *                $ref: '#/definitions/heartbeatswrapper'
 *        default:
 *          description: error
 *          schema:
 *            $ref: '#/definitions/errorModel'
 */
router.get('/heartbeats', function(req, res) {
    apiHelpers.traceAPIRequest(req);
    try {
        service.listHeartbeats(req,res);
    }catch(e) {
        apiHelpers.handleException(req,res,e);
    }
});


/**
 * @swagger
 *  /heartbeat/{unitId}:
 *    get:
 *      operationId: get active heartbeat
 *      description: return current uav heartbeat
 *      summary: return current uav heartbeat
 *      tags:
 *        - heartbeat
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: unitId
 *          in: path
 *          type: string
 *          description: Uav ID
 *          required: true
 *      responses:
 *        '200':
 *          description: return action request array or nothing
 *          schema:
 *            type: object
 *            required:
 *              - code
 *            properties:
 *              code:
 *                type: integer
 *                description: Operation status code
 *              data:
 *                description: action requests to be processed by uav
 *                $ref: '#/definitions/heartbeatwrapper'
 *        default:
 *          description: error
 *          schema:
 *            $ref: '#/definitions/errorModel'
 */
router.get('/heartbeat/:unitId', function(req, res) {
    apiHelpers.traceAPIRequest(req);
    try {
        service.getHeartbeat(req,res);
    }catch(e) {
        apiHelpers.handleException(req,res,e);
    }
});


// UNIT/UAV ADSBS

/**
 * @swagger
 *  /adsb:
 *    post:
 *      operationId: create adsb
 *      description: Create new adsb
 *      summary: Create Adsb
 *      tags:
 *        - adsb
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: adsb
 *          in: body
 *          description: adsb to be created
 *          required: true
 *          schema:
 *            $ref: '#/definitions/adsb'
 *      responses:
 *        '200':
 *          description: return action request array or nothing
 *          schema:
 *            type: object
 *            required:
 *              - code
 *            properties:
 *              code:
 *                type: integer
 *                description: Operation status code
 *              data:
 *                description: action requests to be processed by uav
 *                $ref: '#/definitions/adsbwrapper'
 *        default:
 *          description: error
 *          schema:
 *            $ref: '#/definitions/errorModel'
 */
router.post('/adsb', function(req, res) {
    apiHelpers.traceAPIRequest(req);
    try {
        service.createAdsb(req,res);
    }catch(e) {
        apiHelpers.handleException(req,res,e);
    }
});


/**
 * @swagger
 *  /adsbs:
 *    get:
 *      operationId: get all active adsbs
 *      description: return all current uav adsbs
 *      summary: return all current uav adsbs
 *      tags:
 *        - adsb
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: return action request array or nothing
 *          schema:
 *            type: object
 *            required:
 *              - code
 *            properties:
 *              code:
 *                type: integer
 *                description: Operation status code
 *              data:
 *                description: action requests to be processed by uav
 *                $ref: '#/definitions/adsbswrapper'
 *        default:
 *          description: error
 *          schema:
 *            $ref: '#/definitions/errorModel'
 */
router.get('/adsbs', function(req, res) {
    apiHelpers.traceAPIRequest(req);
    try {
        service.listAdsbs(req,res);
    }catch(e) {
        apiHelpers.handleException(req,res,e);
    }
});

/**
 * @swagger
 *  /adsb/{unitId}:
 *    get:
 *      operationId: get active adsb
 *      description: return current uav adsb
 *      summary: return current uav adsb
 *      tags:
 *        - adsb
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: unitId
 *          in: path
 *          type: string
 *          description: Uav ID
 *          required: true
 *      responses:
 *        '200':
 *          description: return action request array or nothing
 *          schema:
 *            type: object
 *            required:
 *              - code
 *            properties:
 *              code:
 *                type: integer
 *                description: Operation status code
 *              data:
 *                description: action requests to be processed by uav
 *                $ref: '#/definitions/adsbwrapper'
 *        default:
 *          description: error
 *          schema:
 *            $ref: '#/definitions/errorModel'
 */
router.get('/adsb/:unitId', function(req, res) {
    apiHelpers.traceAPIRequest(req);
    try {
        service.getAdsb(req,res);
    }catch(e) {
        apiHelpers.handleException(req,res,e);
    }
});

// UI ACTIONS

/**
 * @swagger
 *  /action:
 *    post:
 *      operationId: add actionrequest to vehicle's queue
 *      description: Create new actionrequest
 *      summary: Create Action Request
 *      tags:
 *        - actionrequest
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: actionrequest
 *          in: body
 *          description: heartbeat to be created
 *          required: true
 *          schema:
 *            $ref: '#/definitions/actionrequest'
 *      responses:
 *        '200':
 *          description: return action request array or nothing
 *          schema:
 *            type: object
 *            required:
 *              - code
 *            properties:
 *              code:
 *                type: integer
 *                description: Operation status code
 *        default:
 *          description: error
 *          schema:
 *            $ref: '#/definitions/errorModel'
 */
router.post('/action', function(req, res) {
    apiHelpers.traceAPIRequest(req);
    try {
        service.addActionRequest(req, res);
    } catch (e) {
        apiHelpers.handleException(req,res,e);
    }
});


/**
 * @swagger
 *  /actions/{unitId}:
 *    get:
 *      operationId: get all active action requests for a vehicle
 *      description: return current uav action requests
 *      summary: return current uav action requests
 *      tags:
 *        - actionrequest
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: unitId
 *          in: path
 *          type: string
 *          description: Uav ID
 *          required: true
 *      responses:
 *        '200':
 *          description: return action request array or nothing
 *          schema:
 *            type: object
 *            required:
 *              - code
 *            properties:
 *              code:
 *                type: integer
 *                description: Operation status code
 *              data:
 *                type: array
 *                description: action requests to be processed by uav
 *                items:
 *                  $ref: '#/definitions/actionrequest'
 *        default:
 *          description: error
 *          schema:
 *            $ref: '#/definitions/errorModel'
 */
router.get('/actions/:unitId', function(req, res) {
    apiHelpers.traceAPIRequest(req);
    try {
        service.listAllActionRequests(req, res);
    } catch (e) {
        apiHelpers.handleException(req,res,e);
    }
});


var deleteActions = function(req, res) {
    apiHelpers.traceAPIRequest(req);
    try {
        service.removeAllActionRequests(req, res);
    } catch (e) {
        apiHelpers.handleException(req, res, e);
    }
}

/**
 * @swagger
 *  /actions/{unitId}:
 *    delete:
 *      operationId: delete all active action requests for a vehicle
 *      description: delete current uav action requests
 *      summary: delete current uav action requests
 *      tags:
 *        - actionrequest
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: unitId
 *          in: path
 *          type: string
 *          description: Uav ID
 *          required: true
 *      responses:
 *        '200':
 *          description: return action request array or nothing
 *        default:
 *          description: error
 */
router.delete('/actions/:unitId', deleteActions);

/**
 * @swagger
 *  /actions/delete/{unitId}:
 *    get:
 *      operationId: delete all active action requests for a vehicle
 *      description: delete current uav action requests
 *      summary: delete current uav action requests
 *      tags:
 *        - actionrequest
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: unitId
 *          in: path
 *          type: string
 *          description: Uav ID
 *          required: true
 *      responses:
 *        '200':
 *          description: return action request array or nothing
 *        default:
 *          description: error
 */
router.get('/actions/delete/:unitId', deleteActions);


/**
 * @swagger
 *  /ping:
 *    get:
 *      operationId: ping
 *      description: ping the serve
 *      summary: get server response
 *      tags:
 *        - ping
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: responds with pong
 *          schema:
 *            type: string
 *        default:
 *          description: error
 *          schema:
 *            $ref: '#/definitions/errorModel'
 */
router.get('/ping', function(req, res) {
    res.status(200).json("pong");
});


module.exports = router;
