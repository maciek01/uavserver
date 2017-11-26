'use strict';

var apidefs = require('./apidefs');

// Api result class
function apiResult(code,httpcode,message,data,error) {

    this.code = typeof code !== 'undefined' ? code : apidefs.API_CODES.FAIL;
    this.httpcode = typeof httpcode !== 'undefined' ? httpcode : 500;
    this.message =  ((typeof message !== 'undefined') && (message) && (message!='')) ? message : null;
    this.error = ((typeof error  !== 'undefined') && (error ) && (error !='')) ? error : null;
    this.data = ((typeof data !== 'undefined') && (data)) ? data : null;

    // this.result will be sent as a response
    this.result = {code:this.code};
    if ( this.error ) {
        this.result.detail = {message:this.message,error:this.error};
    }
    if( this.data ) this.result.data = this.data;
}

module.exports = apiResult;
