'using strict';

const _ = require('lodash');
const baseClient = require('./BaseClient');
const SUPPORTED_CLIENTS = require('./Clients');

class GenderFactory {

    static create(name, key) {
        if(!_.isString(name))
            throw new baseClient.Errors.ClientIllegalArgumentError(
                'platform name should be string'
            );
        if(_.isNil(SUPPORTED_CLIENTS[_.upperFirst(name)]))
            throw new baseClient.Errors.ClientIllegalArgumentError(
                `platform "${name}" is not supported`
            );
        return new SUPPORTED_CLIENTS[_.upperFirst(name)](key);
    }

}

module.exports = GenderFactory ;
