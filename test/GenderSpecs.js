'use strict';

const SRC_PATH = '../src';
const _ = require('lodash');

const config = require('./Resources/config');
const clientConfig = _.find(config, { name: 'genderapi' }).config.key;

const BaseClient = require(`${SRC_PATH}/Platforms/BaseClient`);
const Gender = require(`${SRC_PATH}/Gender`);
const expect = require('./Resources/chai').expect;

describe('Gender', () => {
    let places;

    before(() => {
        places = new Gender(config);
    });

    describe('constructor', () => {
        it('should return a proxy to a client manager' +
            ' with all supported clients', () => {
            const Client = new BaseClient(clientConfig);
            // expected to be dynamically attached to Gender
            const expectedFunctions = _.filter(
                Object.getOwnPropertyNames(Object.getPrototypeOf(Client)),
                property => 'function' === typeof Client[property]
            );

            _.forEach(expectedFunctions, func =>
                expect(places).to.respondTo(func)
            );
        });

        it('should throw error if no config', () => {
            const fn = () => new Gender();
            expect(fn).to.throw(Error)
                .that.instanceOf(Gender.Errors.GenderIllegalArgumentError)
                .and.to.have.property('message').that.equals(
                    'missing or invalid config'
                );
        });

        it('should throw error if invalid config', () => {
            const fn = () => new Gender('config');
            expect(fn).to.throw(Error)
                .that.instanceOf(Gender.Errors.GenderIllegalArgumentError)
                .and.to.have.property('message').that.equals(
                    'missing or invalid config'
                );
        });

        it('should throw error if a non supported method is called', () => {
            const promise = places.nonSupportedMethod('arg1');
            return expect(promise).to.eventually.be.rejected
                .and.is.an.instanceOf(BaseClient.Errors.ClientNotSupportedMethodError)
                .and.has.property('message').that.equals(
                    'nonSupportedMethod is not supported by any client'
                );
        });
    });
});
