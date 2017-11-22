'using strict';

const _ = require('lodash');
const request = require('request-promise-native');

const baseClient = require('../BaseClient');
const Errors = require('../Errors');

const SUPPORTED_METHODS = [
    'determineByName',
];

class Fullcontact extends baseClient {

    getPlatformName() {
        return 'fullcontact' ;
    }

    supports(method) {
        return -1 !== SUPPORTED_METHODS.indexOf(method);
    }

    determineByName(name) {
        const options = {
            uri: 'https://api.fullcontact.com/v2/name/stats.json',
            qs: {
                name,
            },
            headers: {
                'X-FullContact-APIKey': this.key,
            },
            json: true,
        };
        return request(options).then(res => {
            if(_.isEmpty(res.name.given)) {
                //throw NotFoundError
                const errorInstance = {
                    response: {
                        statusCode: 404,
                    },
                    name: 'StatusCodeError',
                    error: {
                        message: 'unknown gender',
                    },

                };
                throw errorInstance ;
            }
            const maleLikelihood = res.name.given.male.likelihood ;
            const femaleLikelihood = res.name.given.female.likelihood ;
            if(maleLikelihood > femaleLikelihood)
                return 'male';
            else if(femaleLikelihood > maleLikelihood)
                return 'female';
            else return 'unknown' ;
        }).catch(err => this._wrapResponseError(err));
    }

    _wrapResponseError(err) {
        let errorInstance;
        const statusCode = err.response.statusCode;

        if('StatusCodeError' === err.name) {
            const error = err.error.message;
            if(400 === statusCode) {
                errorInstance = new Errors.BadRequestError;
            } else if(401 === statusCode) {
                errorInstance = new Errors.NotAuthorizedError;
            } else if(403 === statusCode) {
                errorInstance = new Errors.ForbiddenRequestError;
            } else if(404 === statusCode || 410 === statusCode) {
                errorInstance = new Errors.NotFoundError;
            } else if(406 === statusCode) {
                errorInstance = new Errors.BadRequestError;
            } else if(statusCode in [420, 429]) {
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

module.exports = Fullcontact ;
