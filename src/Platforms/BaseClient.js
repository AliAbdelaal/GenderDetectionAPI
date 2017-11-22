//Gender Detection Interface, any platform that detect the gender
//should implements this Interface
'using strict';

const _ = require('lodash');

class ClientNotImplementedMethodError extends Error {

    constructor(message) {
        super(message);
        this.name = 'ClientNotImplementedMethod';
    }

}

class ClientIllegalArgumentError extends Error {

    constructor(message) {
        super(message);
        this.name = 'ClientIllegalArgument';
    }

}

class ClientNotSupportedMethodError extends Error {

    constructor(message) {
        super(message);
        this.name = 'ClientNotSupportedMethod';
    }

}

class BaseClient {

    constructor(key) {  
        if(!_.isString(key) || _.isNil(key))
            throw new ClientIllegalArgumentError('missing or invalid config');
        this.key = key ;
    }

    getPlatformName() {
        throw new ClientNotImplementedMethodError(
            'a platform client must implement a getPlatformName method'
        );
    }

    determineByName(name) {
        throw new ClientNotImplementedMethodError(
            'a platform client must implement a determineByName method');
    }

    supports(method) {
        throw new ClientNotImplementedMethodError(
            'a platform client must implement a supports method'
        );
    }

}

module.exports = BaseClient ;
module.exports.Errors = {
    ClientIllegalArgumentError,
    ClientNotImplementedMethodError,
    ClientNotSupportedMethodError,
};
