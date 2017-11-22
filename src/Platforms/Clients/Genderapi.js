'using strict';

const _ = require('lodash');
const request = require('request-promise-native');

const baseClient = require('../BaseClient');
const Errors = require('../Errors');

const SUPPORTED_METHODS = [
    'determineByName',
];

class Genderapi extends baseClient {

    getPlatformName() {
        return 'genderapi' ;
    }

    supports(method) {
        return -1 !== SUPPORTED_METHODS.indexOf(method);
    }

    determineByName(name) {
        const options = {
            uri: 'https://gender-api.com/get',
            qs: {
                name,
                key: this.key,
            },
            json: true,
        } ;
        return request(options).then(res => res.gender).catch(
            err => this._wrapResponseError(err));
    }

    _wrapResponseError(err) {
        let errorInstance;
        const statusCode = err.response.statusCode;

        if('StatusCodeError' === err.name) {
            const error = err.error.message;
            if(statusCode in [420, 429, 30]) {
                errorInstance = new Errors.RateLimitError;
            } else if(
                500 === statusCode ||
              502 === statusCode ||
              503 === statusCode ||
              504 === statusCode
            ) {
                errorInstance = new Errors.InternalServerError;
            } else {
                errorInstance = new Errors.BadRequestError;
            }

            errorInstance.details = _.pick(error, ['code', 'message']);
            errorInstance.details.statusCode = statusCode;
        } else {
            errorInstance = new Errors.BadRequestError;
            errorInstance.details = { message: err.message, statusCode };
        }

        throw errorInstance;
    }

}

module.exports = Genderapi ;
