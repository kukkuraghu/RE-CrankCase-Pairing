'use strict';
var debug = require('debug')('example-server');
var mongoose = require('mongoose');
var q = require('q');
var async = require('async');
console.log(process.cwd());
var page = require('./paging').pageBeeper;
var Pairs = mongoose.model('Pairs');
exports.getMatchingCC = getMatchingCC;
exports.getMatchingBeeper = getMatchingBeeper;
exports.getPairs = getPairs;
exports.addPair = addPair;
exports.unpair = unpair;
exports.unpairall = unpairall;
exports.updatePair = updatePair;
exports.pageBeeper = pageBeeper;

var ccLength = process.env.CC_LENGTH;
ccLength = parseInt(ccLength);
if(!ccLength) ccLength = 0;

function getMatchingCC(pager) {
    debug('lib pairs.js getMatchingCC pager : ' + pager);
    var query = Pairs.findOne({beeper : pager});
    return query.exec();
}
function getMatchingBeeper(crankCase) {
    var cc = crankCase;

    //If ccLength is mentioned, trim the crank case to the mentioned length
    if (ccLength) { //ccLength was set from the environment variable
        cc = cc.slice(0, ccLength); 
    }
    var ccMatchingRegExp = new RegExp("^" + cc);
    var query = Pairs.findOne({crankCase : ccMatchingRegExp});
    return query.exec();
}

function getPairs() {
    debug('lib pairs.js getPairs');
    return Pairs.find(null).exec();
}

function addPair(crankCase, beeper, user) {
    return Pairs.create({crankCase : crankCase, beeper : beeper, user : user});
}

function unpair(crankCase, beeper) {
    debug('lib pairs.js function unpair');
    var query = Pairs.find().remove({crankCase : crankCase, beeper : beeper});
    return query.exec();
}

function unpairall() {
    debug('lib pairs.js function unpairall');
    return Pairs.remove({});
}

function updatePair() {
}

function pageBeeper(crankCase) {
    console.log('i am in pageBeeper in lib/pairs.js');
    console.log('crankCase in pageBeeper in lib/pairs.js :' + crankCase);
    var deferred = q.defer();
    async.waterfall([getBeeper, pageBeep], function(error, data){
        debug('in page lib error :' + error);
        debug('in page lib result : ' + data);
        var errorResponse = {};
        if(error) {
            errorResponse.message = error;
            if (data) {
                errorResponse.data = data;
            }
        }
        (error) ? deferred.reject(errorResponse) : deferred.resolve(data);
    });
    return deferred.promise;
    function getBeeper(callback) {
        var getBeeperPromise = getMatchingBeeper(crankCase);
        getBeeperPromise.then(beeperSuccess, beeperFailure);
        function beeperSuccess(data) {
            debug('lib pairs, function beeperSuccess, data : ' + data);
            data ? callback(null,data.beeper, JSON.parse(JSON.stringify(data))) : callback('No matching beeper in the database');
        }
        function beeperFailure(error) {
            debug('lib page, function beeperFailure, error : ' + error);
            callback('Error in reading database');
        }
    }
    function pageBeep(beeperID, data, callback) {
        debug('lib pairs.js pageBeeper pageBeep beeper ID : ' + beeperID);
        debug('lib pairs.js pageBeeper pageBeep data : ' + data);
        var pageStatus = page(beeperID);
        pageStatus.then(pageSucess, pageError);
        function pageSucess(pagerReturn){
            debug(pagerReturn);
            callback(null, data);
        }
        function pageError(error){
            debug(error);
            callback('Error in Paging', data);
        }
    }
}