'use strict';
var express = require('express'); 
var debug = require('debug')('example-server');
var mongoose = require('mongoose'); 
//var Employee = mongoose.model('Employee'); 
//var Pairs = mongoose.model('Pairs'); 
var pairServices = require('../lib/pairs');
var router = express.Router();

router.post('/pair', function(req, res, next) { 
    debug('express POST request route pair ' + 'crankCase :' + req.body.crankCase + ' beeperId :' + req.body.beeper);
    var pairCreationPromise = pairServices.addPair(req.body.crankCase, req.body.beeper);
    pairCreationPromise.then(successHandler, errorHandler);
    function successHandler(result) {
        debug('successfully inserted pair ' + 'crank case :' + result.crankCase + ' beeper : ' + result.beeper );
        debug(result);
        var response = {};
        response.status = 1;
        response.message = 'Crankcase is paired with the buzzer';
        response.data = result;
        return res.status(200).json(response);
    }
    function errorHandler(error) {
        debug('error in saving pair');
        debug(error); 
        if (error.name === 'MongoError' && error.code === 11000) {
        // Duplicate crank case or beeper
            debug('duplicate entry');
            var response = {};
            response.status = 0;
            response.message = 'Either crankcase or buzzer already paired';
            response.data = error;
            debug(response);
            return res.status(200).json(response);
            //return res.status(500).send({ succes: false, message: 'record already exist!' });
        }
        return next(error);
    }
});

router.post('/unpair/:crankcase/:beeper', function(req, res, next) { 
    debug('express POST request route unpair ' + 'crankCase :' + req.body.crankCase + ' beeperId :' + req.body.beeper);
    var unpairPromise = pairServices.unpair(req.body.crankCase, req.body.beeper);
    unpairPromise.then(successHandler, errorHandler);
    function successHandler(result) {
        debug('successfully unpaired');
        debug(result);
        var response = {};
        response.status = 1;
        response.message = 'Crankcase unpaired from the buzzer';
        response.data = JSON.parse(JSON.stringify(result));
        debug(response.data);
        return res.status(200).json(response);
    }
    function errorHandler(error) {
        debug('error in unpairing');
        debug(error); 
        var response = {};
        response.status = 0;
        response.message = 'Unpairing unsuccessful';
        response.data = error;
        debug(response);
        return res.status(200).json(response);
    }
});

router.post('/unpairall', function(req, res, next) { 
    debug('express POST request route unpairall ');
    var unpairAllPromise = pairServices.unpairall();
    unpairAllPromise.then(successHandler, errorHandler);
    function successHandler(result) {
        debug('successfully unpaired');
        debug(result);
        var response = {};
        response.status = 1;
        response.message = 'All pairings removed';
        response.data = JSON.parse(JSON.stringify(result));
        debug(response.data);
        return res.status(200).json(response);
    }
    function errorHandler(error) {
        debug('error in unpairing');
        debug(error); 
        var response = {};
        response.status = 0;
        response.message = 'Unpairing unsuccessful';
        response.data = error;
        debug(response);
        return res.status(200).json(response);
    }
});

router.post('/get_crankcase/:pager', function(req, res, next) { 
    debug('express POST request route pairs get_crankcase ' + 'pager : ' + req.params.pager);
    //pairServices.getMatchingCC ? debug('getMatchingBeeper defined') : debug('getMatchingBeeper not defined');
    var getCCPromise = pairServices.getMatchingCC(req.params.pager);
    getCCPromise.then(CCSuccess, CCFailure);
    function CCSuccess(data) {
        var response = {};
        debug('router get_crankcase, function CCSuccess, data : ' + data);
        if (data) {
            response.status = 1;
            response.message = 'Matching crankcase found';
            response.data = data;
        }
        else {
            response.status = 0;
            response.message = 'Matching crankcase not found';
        }
        return res.status(200).json(response);
    }
    function CCFailure(error) {
        debug('route page get_crankcase error : ' + error);
        res.sendStatus(500);
    }
});
module.exports = router;