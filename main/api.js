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
 */


// API METHODS //////////////////////////////////////////////////////////// //


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
    if(!apiHelpers.preprocessRequest(req,res,[],[])) return;

    try {
        service.createHeartbeat(req,res);
    }catch(e) {
        apiHelpers.handleException(req,res,e);
    }
});


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
