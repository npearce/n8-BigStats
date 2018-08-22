/*
*   BigStatsSettings:
*     Persisted State worker for storing settings.
*
*   N. Pearce, April 2018
*   http://github.com/npearce
*
*/
"use strict";

const logger = require('f5-logger').getInstance();
const os = require("os");

function BigStatsSettings() {
  this.state = {};
}

BigStatsSettings.prototype.WORKER_URI_PATH = "shared/bigstats_settings";
BigStatsSettings.prototype.isPublic = true;
BigStatsSettings.prototype.isSingleton = true;
BigStatsSettings.prototype.isPersisted = true;

/**
 * handle onStart
 */
BigStatsSettings.prototype.onStart = function(success, error) {

    var that = this;
    this.loadState(null,

        function (err, state) {
            if (err) {

                error('[BigStatsSettings] - Error loading state:' +err);
                return;

            }
            else {

                logger.info('[BigStatsSettings] - State loaded.');
                that.state = state;
    
            }

        }

    );
    success();

};

/**
 * handle onGet HTTP request
 */
BigStatsSettings.prototype.onGet = function(restOperation) {

    let hostname = os.hostname();
    let safeHostname = hostname.replace(/\./g, '-');
    this.state.config.hostname = safeHostname;

    // Respond with the persisted state (config)
    restOperation.setBody(this.state);
    this.completeRestOperation(restOperation);
  
};

/**
 * handle onPost HTTP request
 */
BigStatsSettings.prototype.onPost = function(restOperation) {

    var newState = restOperation.getBody();

    // If there's no input
    if (!newState) {

        restOperation.fail(new Error("[BigStatsSettings] - No state provided..."));
        return;

    }
    else if (typeof newState !== 'object') {

        try {

            newState = JSON.parse(newState);

        } catch (err) {

            logger.info('[BigStatsSettings - ERROR] Unable to parse input. Valid JSON?');
            
        }

    }

    logger.info('[BigStatsSettings] - Settings updated.');

    //Check if interval is less that minimum
    this.state = newState;

    if (this.state.config.interval < 10) {
        //Enforcing minimum interval
        this.state.config.interval = 10;
    }


    restOperation.setBody(this.state);
    this.completeRestOperation(restOperation);
      
};

/**
 * handle /example HTTP request
 */
BigStatsSettings.prototype.getExampleState = function () {
  
    return {
        "config": {
            "desintation": {
              "protocol": "[http|https|statsd|kafka]",
              "address": "[ip_address]",
              "port": "[tcp_port]",
              "uri": "[uri]"
            },
            "interval": "[seconds]",
            "debug": false
          }
    };
  
  };

module.exports = BigStatsSettings;