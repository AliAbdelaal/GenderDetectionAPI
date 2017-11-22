'use strict';

const _ = require('lodash');
const ClientFactory = require('./Platforms/ClientFactory');
const ClientValidator = require('./Validators/ClientValidator');
const BaseClient = require('./Platforms/BaseClient');

class GenderIllegalArgumentError extends Error {

    constructor(msg) {
        super(msg);
        this.name = 'GenderIllegalArgumentError' ;
    }

}

class Gender {

    /**
   * @summary Creates an instance of genders.
   * @constructor
   * @memberof Gender
   *
   * @param {Array} clientsConfig array of client config objects
    * @param {Object} client config object needed
    *  to create a client instance
    * @param {string} client.name
    * @param {object} client.key
   */
    constructor(clientsConfig) {
        if(!_.isArray(clientsConfig) || _.isEmpty(clientsConfig))
            throw new GenderIllegalArgumentError('missing or invalid config');

        this._clients = {};

        clientsConfig.forEach(client => {
            this._clients[client.name] = ClientFactory
                .create(client.name, client.config.key);
        });

        const handler = {
            /**
             * dynamically attach methods implemented by clients
             * to the manager
             */
            get: (target, property) => (args, platforms = _.keys(target._clients)) => {
                platforms = _.isArray(platforms) ? platforms : [platforms];
                let isPropertySupported = platforms.length;

                return target._validatePropertyArgs(platforms, property, args)
                    .then(() => {
                        // keep track of error from different clients
                        const errors = [];
                        const promises = platforms.map(
                            platform => {
                                // aggregate results from all needed platforms
                                if(-1 !== _.keys(target._clients).indexOf(platform)) {
                                    const client = target._clients[platform];
                                    if(client.supports(property)) {
                                        return client[property](args)
                                            .catch(err => {
                                                errors.push(err);
                                                return null;
                                            });
                                    } else {
                                        isPropertySupported -= 1;
                                        if(isPropertySupported === 0) {
                                            throw new BaseClient.Errors
                                                .ClientNotSupportedMethodError(
                                                    `${property} is not supported by any client`
                                                );
                                        }
                                    }
                                }
                            }
                        );

                        return Promise.all(promises);
                    })
                    .then(genders =>
                        Promise.resolve(
                            { genders: _.compact(_.flatten(genders)) }
                        )
                    );
            },
        };

        return new Proxy(this, handler);
    }

    _validatePropertyArgs(platforms, property, args) {
        return Promise.all(platforms.map(
            platform => {
                if(_.keys(this._clients).indexOf(platform) !== -1) {
                    return ClientValidator.validate(
                        this._clients[platform],
                        property,
                        [args]
                    );
                }
            }
        ));
    }

}

module.exports = Gender ;
module.exports.Errors = {
    GenderIllegalArgumentError,
};
